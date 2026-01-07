
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 p-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20 rotate-3">
              <span className="text-2xl font-black text-white italic">G</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Urban<span className="text-red-500">Graffiti</span>
            </h1>
          </div>
          <p className="hidden sm:block text-slate-400 text-sm font-medium">
            Powered by Gemini 2.5
          </p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-8">
        {children}
      </main>
      <footer className="border-t border-slate-800 p-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Urban Graffiti Creator. For artistic purposes only.
      </footer>
    </div>
  );
};
