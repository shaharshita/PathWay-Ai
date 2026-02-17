
import React from 'react';
import { AppState } from '../types';
import { CheckCircle2, Circle, Clock, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';

interface LearningRoadmapProps {
  state: AppState;
  isGenerating: boolean;
}

const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ state, isGenerating }) => {
  const { careerPath, selectedRole } = state;

  if (!selectedRole) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Target Role Missing</h3>
        <p className="text-slate-500 mb-8">Please select a job role on the Dashboard to see your roadmap.</p>
        <button 
           onClick={() => window.location.hash = '#dashboard'}
           className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 animate-pulse font-medium">Gemini is crafting your personalized roadmap...</p>
      </div>
    );
  }

  if (!careerPath?.roadmap) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Your Learning Roadmap</h2>
        <p className="text-slate-500">Step-by-step guide to becoming a {selectedRole}.</p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-indigo-100 hidden md:block" />
        
        <div className="space-y-10">
          {careerPath.roadmap.map((step, index) => (
            <div key={index} className="relative flex flex-col md:flex-row gap-8 items-start">
              <div className="z-10 w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-100 shrink-0">
                {index + 1}
              </div>
              
              <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Clock size={14} />
                    {step.duration}
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed">{step.description}</p>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended Resources</h4>
                  <div className="flex flex-wrap gap-2">
                    {step.resources.map((resource, i) => (
                      <a 
                        key={i} 
                        href="#" 
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                      >
                        {resource}
                        <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmap;
