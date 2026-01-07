
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { generateGraffiti } from './services/geminiService';
import { UploadedFile, GenerationState } from './types';

export default function App() {
  const [upload, setUpload] = useState<UploadedFile | null>(null);
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    resultUrl: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpload({
          file,
          preview: reader.result as string,
        });
        // Reset state when new file is chosen
        setState({ isGenerating: false, error: null, resultUrl: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!upload) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const base64Data = upload.preview.split(',')[1];
      const result = await generateGraffiti(base64Data, upload.file.type);
      setState({ isGenerating: false, error: null, resultUrl: result });
    } catch (err: any) {
      setState({ isGenerating: false, error: err.message, resultUrl: null });
    }
  };

  const handleDownload = () => {
    if (!state.resultUrl) return;
    const link = document.createElement('a');
    link.href = state.resultUrl;
    link.download = `graffiti-render-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Column */}
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              Upload Letterform
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Upload an image of a character, logo, or shape. We'll render it as authentic street art on a distressed brick wall.
            </p>

            <label className={`
              relative group flex flex-col items-center justify-center w-full aspect-square sm:aspect-[4/3] 
              border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
              ${upload ? 'border-slate-700 bg-slate-800/30' : 'border-slate-700 hover:border-red-500/50 hover:bg-slate-800/50'}
            `}>
              {upload ? (
                <div className="relative w-full h-full p-4">
                  <img 
                    src={upload.preview} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <span className="text-white font-semibold">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-red-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                  <p className="mb-2 text-sm text-slate-300">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PNG, JPG or WebP (Max 10MB)</p>
                </div>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
                disabled={state.isGenerating}
              />
            </label>

            <button
              onClick={handleGenerate}
              disabled={!upload || state.isGenerating}
              className={`
                mt-8 w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3
                ${!upload || state.isGenerating 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 active:scale-[0.98]'}
              `}
            >
              {state.isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mixing Paint...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  Generate Graffiti
                </>
              )}
            </button>

            {state.error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-sm flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                {state.error}
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
            <h3 className="text-slate-200 font-semibold mb-2">How it works</h3>
            <ul className="text-slate-400 text-sm space-y-3">
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">1.</span>
                Gemini analyzes the silhouette of your uploaded shape.
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">2.</span>
                The AI applies realistic spray physics: overspray, drips, and layering.
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-bold">3.</span>
                A high-detailed weathered brick background is generated to fit the shape.
              </li>
            </ul>
          </div>
        </section>

        {/* Output Column */}
        <section className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><polyline points="16 5 21 5 21 10"/><line x1="12" x2="21" y1="12" y2="3"/></svg>
                Rendered Result
              </h2>
              {state.resultUrl && (
                <button 
                  onClick={handleDownload}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                  title="Download Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </button>
              )}
            </div>

            <div className={`
              relative flex-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/50 min-h-[400px] flex items-center justify-center
              ${state.isGenerating ? 'animate-pulse' : ''}
            `}>
              {state.resultUrl ? (
                <img 
                  src={state.resultUrl} 
                  alt="Graffiti Result" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : state.isGenerating ? (
                <div className="text-center p-8">
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M22 12h-3"/><path d="M5 12H2"/><path d="m18.36 5.64-1.42 1.42"/><path d="m7.05 16.95-1.42 1.42"/><path d="m18.36 18.36-1.42-1.42"/><path d="m7.05 7.05-1.42-1.42"/></svg>
                    </div>
                  </div>
                  <p className="text-slate-300 font-medium mb-2">Analyzing surfaces...</p>
                  <p className="text-slate-500 text-xs max-w-[200px] mx-auto">This usually takes about 10-15 seconds for high resolution renders.</p>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-20"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  <p>Your finished graffiti render will appear here.</p>
                </div>
              )}
            </div>
            
            {state.resultUrl && (
              <div className="mt-6 flex flex-col gap-3">
                 <button 
                  onClick={handleDownload}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  Download HD Render
                </button>
                <button 
                  onClick={() => setState({ isGenerating: false, error: null, resultUrl: null })}
                  className="w-full py-3 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
