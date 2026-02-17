
import React, { useState } from 'react';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-700 text-white rounded-[2rem] mb-8 shadow-[0_20px_50px_rgba(79,70,229,0.3)] animate-pulse">
            <Compass size={40} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-3">Pathway AI</h1>
          <p className="text-white/40 font-semibold text-lg">Charting the future of professional growth.</p>
        </div>

        <div className="glass-panel p-10 md:p-12 rounded-[3rem] border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-50" />
          
          <h2 className="text-2xl font-black text-white mb-10 tracking-tight">
            {isLogin ? "Welcome back" : "Initialize Account"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="group">
                <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 ml-2">Full Designation</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Alex Rivera"
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all text-white font-medium placeholder:text-white/20"
                  />
                </div>
              </div>
            )}
            
            <div className="group">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 ml-2">Digital Identity</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@nexus.com"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all text-white font-medium placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 ml-2">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all text-white font-medium placeholder:text-white/20"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 group active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              {isLogin ? "Authenticate" : "Forge Account"}
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors"
            >
              {isLogin ? "Establish new identity →" : "Re-enter existing session ←"}
            </button>
          </div>
        </div>
        
        <p className="text-center text-white/20 text-[10px] font-black tracking-widest uppercase mt-10">
          Neural Architecture & Design © 2025
        </p>
      </div>
    </div>
  );
};

export default Auth;
