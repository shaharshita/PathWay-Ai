
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { extractTextFromPdf } from '../services/pdfService';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysis } from '../types';

interface ResumeAnalyzerProps {
  onAnalyzed: (analysis: ResumeAnalysis) => void;
  existingAnalysis: ResumeAnalysis | null;
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ onAnalyzed, existingAnalysis }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(file);
      const analysis = await analyzeResume(text);
      onAnalyzed(analysis);
    } catch (err: any) {
      setError("Failed to process resume. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">Resume Extraction</h2>
        <p className="text-white/50 font-medium">We deconstruct your experience into actionable skills.</p>
      </div>

      {!existingAnalysis ? (
        <div className="glass-card border-dashed border-white/20 rounded-[3rem] p-16 text-center group hover:border-indigo-500/50 transition-all duration-500">
          <div className="mx-auto w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-indigo-400 mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl">
            <Upload size={40} />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">Drop your credentials</h3>
          <p className="text-white/40 mb-10 max-w-sm mx-auto font-medium">
            Pathway AI analyzes semantic relationships in your CV using Gemini 3's advanced reasoning.
          </p>
          
          <label className="relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-5 rounded-2xl font-black tracking-widest uppercase text-xs cursor-pointer transition-all shadow-2xl shadow-indigo-900/40">
            {isUploading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
            {isUploading ? "Processing..." : "Import PDF Resume"}
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} />
          </label>

          {error && (
            <div className="mt-8 flex items-center justify-center gap-3 text-red-400 text-sm font-bold bg-red-400/10 py-3 px-6 rounded-xl inline-flex border border-red-400/20">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[2.5rem] border-white/5">
            <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-emerald-400 uppercase tracking-widest text-[11px]">
              <CheckCircle2 size={18} />
              Verified Skills
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {existingAnalysis.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-white/5 text-white/80 text-xs font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border-white/5">
            <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-indigo-400 uppercase tracking-widest text-[11px]">
              <CheckCircle2 size={18} />
              Core Competencies
            </h3>
            <ul className="space-y-4">
              {existingAnalysis.strengths.map((strength, i) => (
                <li key={i} className="flex gap-4 text-sm text-white/60 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shadow-lg shadow-emerald-500/30" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border-white/5">
            <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-amber-400 uppercase tracking-widest text-[11px]">
              <AlertCircle size={18} />
              Improvement areas
            </h3>
            <ul className="space-y-4">
              {existingAnalysis.weaknesses.map((weakness, i) => (
                <li key={i} className="flex gap-4 text-sm text-white/60 font-medium">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shadow-lg shadow-amber-500/30" />
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border-white/5">
            <h3 className="text-lg font-black mb-8 text-white/90 uppercase tracking-widest text-[11px]">Target Gaps</h3>
            <div className="flex flex-wrap gap-2.5">
              {existingAnalysis.missingSkills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-white/5 text-white/40 text-xs font-bold rounded-xl border border-white/5">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 text-center mt-6">
             <button 
                onClick={() => {
                  if (confirm("This will clear your current analysis. Continue?")) {
                    onAnalyzed(null as any); 
                  }
                }}
                className="text-white/20 text-xs font-black tracking-widest uppercase hover:text-white/50 transition-colors"
              >
                Analyze a new profile
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
