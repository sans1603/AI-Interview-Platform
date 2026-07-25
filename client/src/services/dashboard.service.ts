import api from "@/lib/axios";

export interface DashboardData {
  success: boolean;
  dashboard: {
    totalInterviews: number;
    completedInterviews: number;
    averageScore: number;
    highestScore: number;
    recentInterviews: any[];
  };
}

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get("/dashboard");
  return response.data;
};