import api from "@/lib/axios";

export interface CreateInterviewData {
  title: string;
  role: string;
  experienceLevel: string;
  techStack: string;
  totalQuestions: number;
}

export interface SubmittedAnswer {
  questionId: string;
  answer: string;
}

export const getInterviews = async () => {
  const response = await api.get("/interviews");
  return response.data;
};

export const createInterview = async (
  data: CreateInterviewData
) => {
  const response = await api.post("/interviews", data);
  return response.data.interview;
};

export const getInterview = async (id: string) => {
  const response = await api.get(`/interviews/${id}`);
  return response.data.interview;
};

export const submitInterview = async (
  id: string,
  answers: SubmittedAnswer[]
) => {
  const response = await api.post(
    `/interviews/${id}/submit`,
    {
      answers,
    }
  );

  return response.data.interview;
};

export const deleteInterview = async (id: string) => {
  const response = await api.delete(`/interviews/${id}`);
  return response.data;
};