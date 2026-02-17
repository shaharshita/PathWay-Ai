
import React, { useState, useEffect } from 'react';
import { AppState, ResumeAnalysis, CareerPath } from './types';
import { storageService } from './services/storageService';
import { generateCareerAdvice, generateInterviewQuestions } from './services/geminiService';
import { ROLE_SKILLS } from './constants';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import LearningRoadmap from './components/LearningRoadmap';
import InterviewSim from './components/InterviewSim';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    analysis: null,
    selectedRole: null,
    careerPath: null,
    interviewScore: null,
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = storageService.getSession();
    if (saved.user) {
      setState(prev => ({ ...prev, ...saved }));
    }
  }, []);

  useEffect(() => {
    storageService.saveSession(state);
  }, [state]);

  const handleLogin = (email: string) => {
    const user = { id: '1', email, name: email.split('@')[0] };
    setState(prev => ({ ...prev, user }));
  };

  const handleLogout = () => {
    storageService.clearSession();
    setState({
      user: null,
      analysis: null,
      selectedRole: null,
      careerPath: null,
      interviewScore: null,
    });
    setActiveTab('dashboard');
  };

  const handleAnalyzed = (analysis: ResumeAnalysis) => {
    setState(prev => ({ ...prev, analysis, careerPath: null })); // Reset career path if new resume
    setActiveTab('dashboard');
  };

  const calculateReadiness = (resumeSkills: string[], role: string) => {
    const required = ROLE_SKILLS[role] || [];
    if (required.length === 0) return 70;
    const matched = resumeSkills.filter(s => 
      required.some(req => req.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(req.toLowerCase()))
    );
    return Math.round((matched.length / required.length) * 100);
  };

  const handleSelectRole = async (role: string) => {
    if (!state.analysis) return;
    
    setState(prev => ({ ...prev, selectedRole: role, careerPath: null }));
    setIsGenerating(true);

    try {
      const { recommendation, roadmap } = await generateCareerAdvice(state.analysis, role);
      const interviewQuestions = await generateInterviewQuestions(state.analysis, role);
      const readinessScore = calculateReadiness(state.analysis.skills, role);

      setState(prev => ({
        ...prev,
        careerPath: {
          role,
          readinessScore,
          recommendation,
          roadmap,
          interviewQuestions,
        }
      }));
    } catch (err) {
      console.error("AI Generation Error", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInterviewFinished = (score: number) => {
    setState(prev => ({ ...prev, interviewScore: score }));
  };

  if (!state.user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={state.user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && <Dashboard state={state} onSelectRole={handleSelectRole} />}
      {activeTab === 'resume' && <ResumeAnalyzer onAnalyzed={handleAnalyzed} existingAnalysis={state.analysis} />}
      {activeTab === 'roadmap' && <LearningRoadmap state={state} isGenerating={isGenerating} />}
      {activeTab === 'interview' && <InterviewSim state={state} onFinished={handleInterviewFinished} />}
    </Layout>
  );
};

export default App;
