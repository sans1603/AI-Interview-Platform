import prisma from "../config/prisma";

export const getDashboardData = async (userId: string) => {
  const interviews = await prisma.interview.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      questions: true,
    },
  });

  const totalInterviews = interviews.length;

  const completedInterviews = interviews.filter(
    (i) => i.status === "COMPLETED"
  ).length;

  const scores = interviews
    .map((i) => i.overallScore)
    .filter((score): score is number => score !== null);

  const averageScore =
    scores.length === 0
      ? 0
      : scores.reduce((sum, score) => sum + score, 0) / scores.length;

  const highestScore =
    scores.length === 0 ? 0 : Math.max(...scores);

  return {
    totalInterviews,
    completedInterviews,
    averageScore,
    highestScore,
    recentInterviews: interviews.slice(0, 5),
  };
};