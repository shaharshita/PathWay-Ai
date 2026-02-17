
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppState } from '../types';
import { JOB_ROLES } from '../constants';
import { Compass, BrainCircuit, Target, Sparkles } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onSelectRole: (role: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onSelectRole }) => {
  const { analysis, careerPath, interviewScore } = state;

  const calculateOverallScore = () => {
    if (!analysis) return 0;
    const skillsBase = analysis.skills.length * 10;
    const score = Math.min(100, (skillsBase + (careerPath?.readinessScore || 0) + (interviewScore || 0) * 10) / 3);
    return Math.round(score);
  };

  const chartData = [
    { name: 'Profile', value: analysis ? 75 : 0 },
    { name: 'Readiness', value: careerPath?.readinessScore || 0 },
    { name: 'Interview', value: interviewScore ? interviewScore * 10 : 0 },
    { name: 'Resume', value: analysis ? 85 : 0 },
  ];

  const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f472b6'];

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="w-28 h-28 glass-card rounded-full flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-500/10 border-white/20">
          <Sparkles size={56} className="animate-pulse" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Navigate Your Career</h2>
          <p className="text-white/50 max-w-md mx-auto text-lg font-medium leading-relaxed">
            Pathway AI uses Gemini 3 to analyze your professional profile and chart a personalized growth map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Career Intel</h2>
          <p className="text-white/50 font-medium">Real-time mapping of your professional progress.</p>
        </div>
        <div className="glass-card px-8 py-4 rounded-3xl flex items-center gap-6 border-white/10">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mb-1">Success Metric</p>
            <p className="text-4xl font-black text-indigo-400 leading-none">{calculateOverallScore()}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-[3px] border-white/5 border-t-indigo-400 flex items-center justify-center rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass-card p-10 rounded-[2.5rem] border-white/5">
          <h3 className="text-xl font-bold mb-10 text-white/90 tracking-tight">Performance Vector</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15,23,42,0.9)', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' 
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600/90 to-purple-800/90 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/40 flex flex-col justify-between border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
          <div className="relative">
            <Compass size={40} className="mb-6 text-indigo-200" />
            <h3 className="text-2xl font-black mb-3 tracking-tight">Target Trajectory</h3>
            <p className="text-indigo-100/70 text-sm mb-8 font-medium leading-relaxed">
              Define your destination. Pathway AI calibrates your roadmap instantly.
            </p>
          </div>
          <select 
            value={state.selectedRole || ""}
            onChange={(e) => onSelectRole(e.target.value)}
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-white/10 appearance-none cursor-pointer hover:bg-white/15 transition-all"
          >
            <option value="" disabled className="bg-slate-900">Choose your path...</option>
            {JOB_ROLES.map(role => (
              <option key={role} value={role} className="bg-slate-900">{role}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-white/90 tracking-tight">AI Insights</h3>
          </div>
          {careerPath ? (
            <div className="space-y-6">
              <div className="flex justify-between items-end text-sm">
                <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Readiness Profile</span>
                <span className="font-black text-emerald-400 text-2xl">{careerPath.readinessScore}%</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/20" 
                  style={{ width: `${careerPath.readinessScore}%` }} 
                />
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-sm text-white/70 italic leading-relaxed font-medium">
                  "{careerPath.recommendation}"
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/30 font-medium italic">Select a target role to visualize your readiness.</p>
          )}
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] border-white/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <BrainCircuit size={24} />
            </div>
            <h3 className="text-xl font-bold text-white/90 tracking-tight">Recent Benchmarks</h3>
          </div>
          {interviewScore !== null ? (
            <div className="text-center py-6">
              <p className="text-7xl font-black text-white mb-2 leading-none">{interviewScore}<span className="text-white/20 text-4xl">/10</span></p>
              <p className="text-sm text-white/40 font-bold uppercase tracking-widest mt-4">Last Mock Performance</p>
              <div className="mt-8 inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-5 py-2 rounded-full uppercase">
                Trending Up +15%
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-white/30 text-sm mb-6 font-medium">No simulation data available.</p>
              <button 
                onClick={() => document.getElementById('interview-tab')?.click()}
                className="text-indigo-400 text-sm font-black tracking-widest uppercase hover:text-indigo-300 transition-colors"
              >
                Launch Mock Session →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
