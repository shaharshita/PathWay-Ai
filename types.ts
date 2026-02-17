
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ResumeAnalysis {
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  resumeText: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
}

export interface InterviewResult {
  score: number;
  feedback: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  resources: string[];
  duration: string;
}

export interface CareerPath {
  role: string;
  readinessScore: number;
  recommendation: string;
  roadmap: RoadmapStep[];
  interviewQuestions: InterviewQuestion[];
}

export interface AppState {
  user: User | null;
  analysis: ResumeAnalysis | null;
  selectedRole: string | null;
  careerPath: CareerPath | null;
  interviewScore: number | null;
}
