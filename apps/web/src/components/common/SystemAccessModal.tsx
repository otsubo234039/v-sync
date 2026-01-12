"use client";
import { useState, useRef, useEffect } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function SystemAccessModal({ onClose, onSuccess }: Props) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === "wearenijisanji" || input === "admin") {
      setStatus('success');
      setTimeout(onSuccess, 1000);
    } else {
      setStatus('error');
      setInput("");
      setTimeout(() => setStatus('idle'), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200" onClick={onClose}>
      <div className={`w-full max-w-md bg-black border-2 p-8 font-mono shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors duration-300 ${status === 'idle' ? 'border-brand/50 shadow-brand/20' : ''} ${status === 'error' ? 'border-red-600 shadow-red-600/50 animate-[shake_0.5s_ease-in-out]' : ''} ${status === 'success' ? 'border-cyan-500 shadow-cyan-500/50' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        <div className="relative z-10">
          <h2 className={`text-xl font-bold mb-6 tracking-widest border-b pb-2 ${status === 'error' ? 'text-red-500 border-red-500' : status === 'success' ? 'text-cyan-400 border-cyan-500' : 'text-brand border-brand/50'}`}>
            {status === 'error' ? '⚠ ACCESS DENIED' : status === 'success' ? '✔ IDENTITY VERIFIED' : '🔒 SYSTEM OVERRIDE'}
          </h2>
          <p className="text-xs text-slate-400 mb-4">Enter system passcode to proceed.</p>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 bg-[#0A1010] border border-slate-700 p-3 rounded mb-4 focus-within:border-brand transition-colors">
              <span className="text-brand font-bold">{">"}</span>
              <input ref={inputRef} type="password" className="bg-transparent border-none outline-none text-brand w-full font-bold placeholder-slate-700" placeholder="PASSWORD" value={input} onChange={e => setInput(e.target.value)} disabled={status === 'success'} />
              <span className="animate-pulse text-brand">_</span>
            </div>
            {status === 'error' && <p className="text-red-500 text-xs font-bold mb-4 animate-pulse">Invalid credentials.</p>}
            {status === 'success' && <p className="text-cyan-400 text-xs font-bold mb-4 animate-pulse">Redirecting to Admin Portal...</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 text-xs hover:text-white">CANCEL</button>
              <button type="submit" disabled={status === 'success'} className={`px-6 py-2 rounded text-xs font-bold transition-all shadow-lg ${status === 'success' ? 'bg-cyan-600 text-white' : 'bg-brand text-black hover:brightness-110'}`}>LOGIN</button>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 75% { transform: translateX(5px) rotate(5deg); } }`}</style>
    </div>
  );
}