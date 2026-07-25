import prisma from "../config/prisma";
import {
  generateInterviewQuestions,
  evaluateInterview,
} from "./ai.service";

interface CreateInterviewData {
  userId: string;
  title: string;
  role: string;
  experienceLevel: string;
  techStack: string;
  totalQuestions: number;
}

interface SubmittedAnswer {
  questionId: string;
  answer: string;
}

export const createInterview = async (
  data: CreateInterviewData
) => {
  const questions = await generateInterviewQuestions(
    data.role,
    data.experienceLevel,
    data.techStack,
    data.totalQuestions
  );

  return await prisma.$transaction(async (tx) => {
    const interview = await tx.interview.create({
      data: {
        userId: data.userId,
        title: data.title,
        role: data.role,
        experienceLevel: data.experienceLevel,
        techStack: data.techStack,
        totalQuestions: data.totalQuestions,
        status: "PENDING",
      },
    });

    await tx.question.createMany({
      data: questions.map(
        (q: { question: string }, index: number) => ({
          interviewId: interview.id,
          question: q.question,
          order: index + 1,
        })
      ),
    });

    return tx.interview.findUnique({
      where: {
        id: interview.id,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  });
};

export const getInterviewById = async (
  interviewId: string,
  userId: string
) => {
  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
      userId,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!interview) {
    throw new Error("Interview not found");
  }

  return interview;
};

export const submitInterview = async (
  interviewId: string,
  userId: string,
  answers: SubmittedAnswer[]
) => {
  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
      userId,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!interview) {
    throw new Error("Interview not found");
  }

  const evaluation = await evaluateInterview(
    answers.map((item) => {
      const question = interview.questions.find(
        (q) => q.id === item.questionId
      );

      return {
        questionId: item.questionId,
        question: question?.question ?? "",
        answer: item.answer,
      };
    })
  );

  for (let i = 0; i < interview.questions.length; i++) {
    const question = interview.questions[i];
    const submitted = answers.find(
      (a) => a.questionId === question.id
    );
    const evaluationResult = evaluation.questions[i];

    if (!evaluationResult) continue;

    await prisma.question.update({
      where: {
        id: question.id,
      },
      data: {
        answer: submitted?.answer ?? "",
        score: evaluationResult.score,
        feedback: evaluationResult.feedback,
      },
    });
  }

  await prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      status: "COMPLETED",
      overallScore: evaluation.overallScore,
      overallFeedback: evaluation.overallFeedback,

      overallStrengths: Array.isArray(evaluation.strengths)
        ? evaluation.strengths.join("\n")
        : evaluation.strengths,

      overallImprovements: Array.isArray(evaluation.improvements)
        ? evaluation.improvements.join("\n")
        : evaluation.improvements,

      completedAt: new Date(),
    },
  });

  return prisma.interview.findUnique({
    where: {
      id: interviewId,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
};

export const completeInterview = async (
  interviewId: string,
  userId: string
) => {
  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
      userId,
    },
    include: {
      questions: true,
    },
  });

  if (!interview) {
    throw new Error("Interview not found");
  }

  const answeredQuestions = interview.questions.filter(
    (q) => q.score !== null
  );

  const overallScore =
    answeredQuestions.length === 0
      ? 0
      : answeredQuestions.reduce(
          (sum, q) => sum + (q.score ?? 0),
          0
        ) / answeredQuestions.length;

  return prisma.interview.update({
    where: {
      id: interviewId,
    },
    data: {
      status: "COMPLETED",
      overallScore,
      completedAt: new Date(),
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
};

export const getUserInterviews = async (
  userId: string
) => {
  return prisma.interview.findMany({
    where: {
      userId,
    },
    include: {
      questions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteInterview = async (
  interviewId: string,
  userId: string
) => {
  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
      userId,
    },
  });

  if (!interview) {
    throw new Error("Interview not found");
  }

  await prisma.interview.delete({
    where: {
      id: interviewId,
    },
  });

  return {
    message: "Interview deleted successfully",
  };
};