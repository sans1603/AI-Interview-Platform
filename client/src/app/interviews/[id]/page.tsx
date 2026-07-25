"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getInterview,
  submitInterview,
} from "@/services/interview.service";
import { Button } from "@/components/ui/button";

import ProtectedRoute from "@/components/ProtectedRoute";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Question {
  id: string;
  question: string;
  answer: string | null;
  feedback: string |null;
  score: number | null;
  order: number | null;
}

interface Interview {
  id: string;
  title: string;
  role: string;
  experienceLevel: string;
  techStack: string;
  totalQuestions: number;
  questions: Question[];
}

export default function InterviewPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interview = await getInterview(id);

        setInterview(interview);

        setTimeLeft(interview.questions.length * 120);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchInterview();
    }
  }, [id]);

  const currentQuestion =
    interview?.questions[currentQuestionIndex];

  const progress = interview
    ? ((currentQuestionIndex + 1) /
        interview.questions.length) *
      100
    : 0;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!submitting && interview) {
        handleFinish();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, interview, submitting]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognitionInstance =
      new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onend = () => {
      if (isListening) {
        recognitionInstance.start();
      } else {
        setIsListening(false);
      }
    };

    recognitionInstance.onresult = (event: any) => {
      if (!currentQuestion) return;

      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]:
          (prev[currentQuestion.id] ?? "") + finalTranscript,
      }));
    };

    setRecognition(recognitionInstance);
  }, [currentQuestion]);

  const startListening = () => {
    if (!recognition) return;

    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (!recognition) return;

    setIsListening(false);
    recognition.stop();
  };

  const handleNext = () => {
    if (
      interview &&
      currentQuestionIndex <
        interview.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {

    if (submitting) return;
    if (!interview) return;

    try {
      setSubmitting(true);

      const submittedAnswers = interview.questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? "",
      }));

      await submitInterview(id, submittedAnswers);

      router.push(`/results/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to submit interview.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!interview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-500">
          Loading Interview...
        </p>
      </main>
    );
  }

    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-slate-50">
          <div className="mx-auto max-w-5xl px-8 py-10">

            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  {interview.title}
                </h1>

                <p className="mt-2 text-slate-500">
                  {interview.role} • {interview.experienceLevel}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 px-5 py-3 shadow-sm">
                <p className="text-sm text-red-500 font-medium">
                  Time Remaining
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </p>

                <p className="mt-1 text-xs text-red-500">
                  Interview will be submitted automatically when time expires.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="mb-8">

                <div className="mb-2 flex justify-between text-sm text-slate-500">
                  <span>Interview Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

              </div>

              <p className="text-sm font-semibold text-violet-600">
                Question {currentQuestionIndex + 1} of{" "}
                {interview.questions.length}
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-slate-900 leading-relaxed">
                {currentQuestion?.question}
              </h2>

              <textarea
                value={
                  currentQuestion
                    ? answers[currentQuestion.id] ?? ""
                    : ""
                }
                onChange={(e) => {
                  if (!currentQuestion) return;

                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: e.target.value,
                  }));
                }}
                placeholder="Type your answer here..."
                className="mt-8 h-56 w-full resize-none rounded-2xl border border-slate-200 p-5 text-base outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />

              <div className="mt-6 flex gap-4">

                {!isListening ? (
                  <Button
                    type="button"
                    onClick={startListening}
                    className="rounded-xl bg-green-600 hover:bg-green-700"
                  >
                    🎤 Start Speaking
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={stopListening}
                    className="rounded-xl bg-red-600 hover:bg-red-700"
                  >
                    ⏹ Stop Recording
                  </Button>
                )}

                <div className="flex items-center text-sm text-slate-500">
                  {isListening
                    ? "Listening..."
                    : "Microphone Ready"}
                </div>

              </div>

              <div className="mt-10 flex items-center justify-between">

                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="rounded-xl px-6"
                >
                  ← Previous
                </Button>

                <div className="flex gap-4">

                  {currentQuestionIndex ===
                  interview.questions.length - 1 ? (
                    <Button
                      onClick={handleFinish}
                      disabled={submitting}
                      className="rounded-xl bg-green-600 hover:bg-green-700"
                    >
                      {submitting ? "Evaluating..." : "Finish Interview"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="rounded-xl bg-violet-600 hover:bg-violet-700"
                    >
                      Next →
                    </Button>
                  )}

                </div>

              </div>

            </div>

          </div>
        </main>
      </ProtectedRoute>
  );
}