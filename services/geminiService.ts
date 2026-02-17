
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis, InterviewQuestion, RoadmapStep, InterviewResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeResume(text: string): Promise<ResumeAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this resume text and extract skills, strengths, weaknesses, and missing skills for a generic tech role. \n\n Resume Text: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["skills", "strengths", "weaknesses", "missingSkills"],
      },
    },
  });

  const analysis = JSON.parse(response.text);
  return { ...analysis, resumeText: text };
}

export async function generateCareerAdvice(resumeAnalysis: ResumeAnalysis, targetRole: string): Promise<{ recommendation: string; roadmap: RoadmapStep[] }> {
  const prompt = `Based on the following resume analysis, provide a career recommendation for the role of ${targetRole} and a detailed learning roadmap.
  Skills: ${resumeAnalysis.skills.join(", ")}
  Weaknesses: ${resumeAnalysis.weaknesses.join(", ")}
  Missing Skills: ${resumeAnalysis.missingSkills.join(", ")}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendation: { type: Type.STRING },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                duration: { type: Type.STRING },
              },
              required: ["title", "description", "resources", "duration"],
            }
          },
        },
        required: ["recommendation", "roadmap"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function generateInterviewQuestions(resumeAnalysis: ResumeAnalysis, targetRole: string): Promise<InterviewQuestion[]> {
  const prompt = `Generate 5 professional interview questions for a ${targetRole} candidate with these skills: ${resumeAnalysis.skills.join(", ")}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
          },
          required: ["id", "question"],
        },
      },
    },
  });

  return JSON.parse(response.text);
}

export async function evaluateAnswers(qaPairs: { question: string; answer: string }[]): Promise<InterviewResult> {
  const prompt = `Evaluate the following interview answers and provide a score out of 10 and constructive feedback.
  ${qaPairs.map((p, i) => `Q${i + 1}: ${p.question}\nA${i + 1}: ${p.answer}`).join("\n\n")}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
        },
        required: ["score", "feedback"],
      },
    },
  });

  return JSON.parse(response.text);
}
