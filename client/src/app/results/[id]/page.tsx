"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getInterview } from "@/services/interview.service";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Question {
  id: string;
  question: string;
  answer: string | null;
  score: number | null;
  feedback: string | null;
}

interface Interview {
  id: string;
  title: string;
  role: string;
  overallScore: number | null;
  overallFeedback: string | null;
  overallStrengths: string | null;
  overallImprovements: string | null;
  questions: Question[];
}

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [interview, setInterview] =
    useState<Interview | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterview();
  }, []);

  const loadInterview = async () => {
    try {
      const data = await getInterview(id);
      setInterview(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex h-screen items-center justify-center">
        Interview not found.
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl space-y-8 p-8">
        <h1 className="text-4xl font-bold">
          Interview Results
        </h1>

        <Card>
          <CardContent className="space-y-4 p-8">

            <div className="text-center">

              <h2 className="text-xl font-semibold">
                Overall Score
              </h2>

              <div className="mt-4 text-6xl font-bold text-green-600">

                {interview.overallScore?.toFixed(1)}/10

              </div>

            </div>

            <div>

              <h3 className="mb-2 text-lg font-semibold">

                Overall Feedback

              </h3>

              <p>

                {interview.overallFeedback}

              </p>

            </div>

            <div>

              <h3 className="mb-2 text-lg font-semibold">

                Strengths

              </h3>

              <pre className="whitespace-pre-wrap font-sans">

                {interview.overallStrengths}

              </pre>

            </div>

            <div>

              <h3 className="mb-2 text-lg font-semibold">

                Areas for Improvement

              </h3>

              <pre className="whitespace-pre-wrap font-sans">

                {interview.overallImprovements}

              </pre>

            </div>

          </CardContent>
        </Card>

        <div className="space-y-6">
          {interview.questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Question {index + 1}
                  </h2>

                  <div className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
                    {question.score?.toFixed(1) ?? 0}/10
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Question</h3>
                  <p>{question.question}</p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Your Answer</h3>
                  <div className="rounded-lg border bg-muted p-4 whitespace-pre-wrap">
                    {question.answer || "No answer provided"}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">AI Feedback</h3>
                  <div className="rounded-lg border bg-blue-50 p-4 whitespace-pre-wrap">
                    {question.feedback || "No feedback available"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 👇 ADD THIS NEW SECTION */}
        <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Button
            className="rounded-xl bg-violet-600 hover:bg-violet-700"
            onClick={() => router.push("/interviews/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Interview
          </Button>
        </div>

      </div>
    </ProtectedRoute>
  );
}