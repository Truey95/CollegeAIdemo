
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

const AIVoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Manually implement encode/decode as per guidelines
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startSession = async () => {
    setStatus('connecting');
    try {
      // Always initialize right before use with direct process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              // CRITICAL: Solely rely on sessionPromise resolves to send input
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Raw PCM audio decoding logic
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const ctx = outputAudioContextRef.current!;
              // Align next chunk with previous chunk's end time for gapless playback
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscriptions(prev => [...prev, `AI: ${text}`]);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscriptions(prev => [...prev, `You: ${text}`]);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Live API Error:', e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are the Albertus Magnus College Assistant. Help users with admissions, campus life, and programs in a friendly, helpful way.",
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start Live Session:', err);
      setStatus('idle');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    setIsActive(false);
    setStatus('idle');
    setTranscriptions([]);
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#002D62] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[500px]">
      <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-[#003366] to-[#001A3A] relative">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 relative z-10 ${isActive ? 'bg-[#FFC72C] gold-glow animate-pulse' : 'bg-white/10'}`}>
          <svg className={`w-12 h-12 ${isActive ? 'text-[#002D62]' : 'text-blue-200'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </div>
        
        <h3 className="text-white text-2xl font-bold mb-2 serif">AI Voice Tour</h3>
        <p className="text-blue-200 text-center mb-8">
          {status === 'idle' && "Speak directly with our digital campus guide."}
          {status === 'connecting' && "Establishing connection..."}
          {status === 'listening' && "I'm listening. How can I help?"}
        </p>

        <button
          onClick={isActive ? stopSession : startSession}
          className={`px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${isActive ? 'bg-red-500 text-white' : 'bg-[#FFC72C] text-[#002D62]'}`}
        >
          {isActive ? 'End Conversation' : 'Start Talking'}
        </button>
      </div>

      <div className="md:w-1/2 bg-white/5 backdrop-blur-sm p-6 overflow-y-auto">
        <div className="space-y-4">
          {transcriptions.length === 0 ? (
            <div className="text-blue-300 text-sm italic text-center mt-20">
              Live transcription will appear here...
            </div>
          ) : (
            transcriptions.map((t, i) => (
              <div key={i} className={`p-3 rounded-xl text-sm ${t.startsWith('AI:') ? 'bg-white/10 text-white self-start' : 'bg-[#FFC72C]/20 text-[#FFC72C] self-end'}`}>
                {t}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVoiceAssistant;
