
import React, { useState } from 'react';
import { generateImage, editImage } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';

const AIImageTools: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.RATIO_1_1);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [editPrompt, setEditPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const url = await generateImage(prompt, aspectRatio, imageSize);
      setGeneratedUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!generatedUrl || !editPrompt) return;
    setIsLoading(true);
    try {
      const url = await editImage(generatedUrl, editPrompt);
      if (url) setGeneratedUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-[#002D62] serif flex items-center gap-2">
        <svg className="w-6 h-6 text-[#FFC72C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        Falcon Imaginer
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-[#002D62] focus:outline-none"
            placeholder="A futuristic library at Albertus Magnus College with students using holographic displays..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Aspect Ratio</label>
            <select 
              value={aspectRatio} 
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none"
            >
              {Object.values(AspectRatio).map(ratio => <option key={ratio} value={ratio}>{ratio}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Resolution</label>
            <select 
              value={imageSize} 
              onChange={(e) => setImageSize(e.target.value as ImageSize)}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none"
            >
              {Object.values(ImageSize).map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-[#002D62] text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Generating Excellence...' : 'Generate Image'}
        </button>

        {generatedUrl && (
          <div className="mt-8 space-y-4 animate-in fade-in duration-500">
            <div className="relative rounded-2xl overflow-hidden border">
              <img src={generatedUrl} alt="Generated AI" className="w-full h-auto" />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-sm font-bold text-[#002D62] mb-2">Refine this image</h4>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g. 'Add a retro filter' or 'Make it sunset'"
                  className="flex-grow bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <button 
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="bg-[#FFC72C] text-[#002D62] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#E5B627]"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIImageTools;
