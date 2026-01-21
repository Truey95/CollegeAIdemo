
import React, { useState } from 'react';
import { generateVideo } from '../services/geminiService';

const AIVideoTools: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyzing your creative vision...",
    "Modeling fluid motion vectors...",
    "Applying high-definition textures...",
    "Synthesizing final frames...",
    "Polishing the cinematic output..."
  ];

  const handleGenerateVideo = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(s => (s + 1) % loadingMessages.length);
    }, 4000);

    try {
      const url = await generateVideo(prompt, aspectRatio);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-[#002D62] rounded-3xl p-8 shadow-lg text-white">
      <h3 className="text-2xl font-bold mb-6 serif flex items-center gap-2">
        <svg className="w-6 h-6 text-[#FFC72C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        Falcon Cinema (Veo)
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-blue-200 mb-2">Describe the Motion</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-sm min-h-[100px] text-white focus:ring-2 focus:ring-[#FFC72C] focus:outline-none"
            placeholder="A drone shot sweeping over the New Haven campus during autumn with leaves falling in slow motion..."
          />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setAspectRatio('16:9')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${aspectRatio === '16:9' ? 'bg-[#FFC72C] text-[#002D62]' : 'bg-white/10 text-white'}`}
          >
            Landscape (16:9)
          </button>
          <button 
            onClick={() => setAspectRatio('9:16')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${aspectRatio === '9:16' ? 'bg-[#FFC72C] text-[#002D62]' : 'bg-white/10 text-white'}`}
          >
            Portrait (9:16)
          </button>
        </div>

        <button
          onClick={handleGenerateVideo}
          disabled={isGenerating}
          className="w-full bg-[#FFC72C] text-[#002D62] py-4 rounded-xl font-bold hover:bg-[#E5B627] transition-all disabled:opacity-50 relative overflow-hidden"
        >
          {isGenerating ? (
            <div className="flex flex-col items-center gap-1">
              <span>{loadingMessages[loadingStep]}</span>
              <div className="w-full h-1 bg-[#002D62]/20 absolute bottom-0 left-0">
                <div className="h-full bg-[#002D62] animate-[progress_15s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
              </div>
            </div>
          ) : 'Animate with Veo'}
        </button>

        {videoUrl && (
          <div className="mt-8 animate-in zoom-in duration-500">
            <video 
              src={videoUrl} 
              controls 
              className="w-full rounded-2xl shadow-2xl border border-white/10"
              autoPlay
              loop
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; left: 0%; }
          50% { width: 50%; left: 25%; }
          100% { width: 0%; left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default AIVideoTools;
