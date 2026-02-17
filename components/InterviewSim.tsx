
import React, { useState } from 'react';
import { BrainCircuit, Mic, Send, ChevronRight, CheckCircle2, Loader2, Play } from 'lucide-react';
import { AppState, InterviewQuestion, InterviewResult } from '../types';
import { evaluateAnswers } from '../services/geminiService';

interface InterviewSimProps {
  state: AppState;
  onFinished: (score: number) => void;
}

const InterviewSim: React.FC<InterviewSimProps> = ({ state, onFinished }) => {
  const { careerPath, selectedRole } = state;
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<InterviewResult | null>(null);

  const startInterview = () => setCurrentIndex(0);

  const handleNext = async () => {
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentIndex < (careerPath?.interviewQuestions.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsEvaluating(true);
      try {
        const qaPairs = careerPath!.interviewQuestions.map((q, i) => ({
          question: q.question,
          answer: newAnswers[i],
        }));
        const evalResult = await evaluateAnswers(qaPairs);
        setResult(evalResult);
        onFinished(evalResult.score);
      } catch (err) {
        console.error(err);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  if (!selectedRole || !careerPath?.interviewQuestions) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to practice?</h3>
        <p className="text-slate-500 mb-8">Select a role on the dashboard to generate tailored interview questions.</p>
        <button 
           onClick={() => window.location.hash = '#dashboard'}
           className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium"
        >
          Select Role
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 p-10 text-center shadow-sm">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Interview Complete!</h2>
        <div className="text-6xl font-black text-indigo-600 my-8">{result.score}/10</div>
        <div className="text-left bg-slate-50 p-6 rounded-2xl mb-8">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">AI Feedback</h4>
          <p className="text-slate-700 leading-relaxed">{result.feedback}</p>
        </div>
        <button 
          onClick={() => {
            setResult(null);
            setCurrentIndex(-1);
            setAnswers([]);
          }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (currentIndex === -1) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-indigo-600 rounded-3xl p-10 text-white overflow-hidden relative">
          <BrainCircuit size={120} className="absolute -right-8 -bottom-8 text-indigo-500 opacity-20" />
          <h2 className="text-3xl font-bold mb-4">Mock Interview Session</h2>
          <p className="text-indigo-100 mb-8 max-w-lg">
            We've prepared 5 specialized questions for a {selectedRole} role. 
            This session will test your technical depth and communication skills.
          </p>
          <button 
            onClick={startInterview}
            className="flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all"
          >
            <Play size={20} />
            Start Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
             <h4 className="font-bold mb-2">How it works</h4>
             <p className="text-sm text-slate-500">Answer each question to the best of your ability. Our AI will analyze your responses for technical accuracy and tone.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100">
             <h4 className="font-bold mb-2">Personalized</h4>
             <p className="text-sm text-slate-500">Questions are generated based on your resume and your target job description.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isEvaluating) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 animate-pulse font-medium">Gemini is evaluating your performance...</p>
      </div>
    );
  }

  const currentQuestion = careerPath.interviewQuestions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mock Interview</h2>
          <p className="text-slate-500">Question {currentIndex + 1} of 5</p>
        </div>
        <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / 5) * 100}%` }} 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h3>
        </div>
        
        <div className="p-8 space-y-6">
          <textarea 
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-slate-700"
          />
          
          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 text-slate-400 font-medium hover:text-indigo-600 transition-colors">
              <Mic size={20} />
              Use Microphone
            </button>
            <button 
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className="flex items-center gap-2 bg-indigo-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {currentIndex === 4 ? "Finish Interview" : "Next Question"}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSim;
