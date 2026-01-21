
import React, { useState, useRef, useEffect } from 'react';
import { generateComplexText, searchGrounding } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      if (useSearch) {
        response = await searchGrounding(input);
      } else {
        response = await generateComplexText(input, useThinking);
      }

      const aiMsg: ChatMessage = { 
        role: 'model', 
        text: response.text || "I'm sorry, I couldn't process that.", 
        timestamp: new Date(),
        isThinking: useThinking
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to Gemini. Please check your connection.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] md:w-[400px] h-[550px] flex flex-col border border-gray-200 animate-in zoom-in-95 duration-200">
          <div className="bg-[#002D62] p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FFC72C] rounded-full flex items-center justify-center font-bold text-[#002D62]">A</div>
              <div>
                <h4 className="text-white font-bold text-sm">Falcon AI Guide</h4>
                <p className="text-blue-200 text-xs">Powered by Gemini 3 Pro</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between gap-2">
             <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-[10px] font-bold text-[#002D62] cursor-pointer">
                  <input type="checkbox" checked={useThinking} onChange={() => setUseThinking(!useThinking)} className="rounded" />
                  Thinking
                </label>
                <label className="flex items-center gap-1 text-[10px] font-bold text-[#002D62] cursor-pointer">
                  <input type="checkbox" checked={useSearch} onChange={() => setUseSearch(!useSearch)} className="rounded" />
                  Search
                </label>
             </div>
             <button onClick={() => setMessages([])} className="text-[10px] text-gray-400 hover:text-red-500 underline">Clear Chat</button>
          </div>

          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm italic">Hello! I'm Falcon AI. Ask me about admissions, academics, or campus life at Albertus!</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-[#002D62] text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.isThinking && <div className="text-[10px] text-blue-500 font-bold mb-1">DEEP REASONING ACTIVE</div>}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3 text-sm animate-pulse flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t bg-white rounded-b-2xl">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#002D62]"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-[#002D62] hover:text-[#FFC72C] p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#002D62] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-[#003366] transition-all transform hover:scale-110 gold-glow"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AIChatbot;
