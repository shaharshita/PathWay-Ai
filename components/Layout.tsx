
import React from 'react';
import { Compass, FileText, LayoutDashboard, BrainCircuit, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume Analysis', icon: FileText },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'interview', label: 'Mock Interview', icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4 md:p-6 gap-6 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-72 glass-panel rounded-[2.5rem] p-8 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Compass size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white/90">Pathway AI</h1>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-white/10 text-white shadow-inner border-white/10'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-indigo-400' : ''} />
              <span className="font-semibold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-white font-bold text-lg shadow-xl">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white/90 truncate">{user?.name}</p>
              <p className="text-xs text-white/40 truncate font-medium">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300 font-bold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto glass-panel rounded-[2.5rem] p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
