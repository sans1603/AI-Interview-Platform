"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { getDashboard } from "@/services/dashboard.service";
import { deleteInterview } from "@/services/interview.service";

import ProtectedRoute from "@/components/ProtectedRoute";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    highestScore: 0,
    recentInterviews: [] as any[],
  });

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInterview(id);

      toast.success("Interview deleted successfully.");

      await fetchDashboard();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete interview.");
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await getDashboard();

      setDashboard(response.dashboard);
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    fetchDashboard();
  }, [router]);

  const stats = [
    {
      title: "Total Interviews",
      value: dashboard.totalInterviews,
    },
    {
      title: "Completed",
      value: dashboard.completedInterviews,
    },
    {
      title: "Average Score",
      value: `${dashboard.averageScore.toFixed(1)}/10`,
    },
    {
      title: "Highest Score",
      value: `${dashboard.highestScore.toFixed(1)}/10`,
    },
  ];

  // ---------------- LOADING SKELETON ----------------

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-slate-50">
          <div className="mx-auto max-w-7xl px-8 py-8">

            <div className="mb-10">
              <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
              <div className="mt-3 h-5 w-96 animate-pulse rounded-lg bg-slate-200" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-3xl bg-white shadow-sm"
                />
              ))}
            </div>

            <div className="mt-12">
              <div className="mb-6 h-8 w-56 animate-pulse rounded-lg bg-slate-200" />

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-2xl bg-white shadow-sm"
                  />
                ))}
              </div>
            </div>

          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-8 py-8">

          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Welcome back 👋
              </h1>

              <p className="mt-2 text-slate-500">
                Here's an overview of your interview preparation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button variant="outline">
                      Logout
                    </Button>
                  }
                />

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Logout?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      Are you sure you want to logout?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Link href="/interviews/new">
                <Button className="rounded-xl bg-violet-600 hover:bg-violet-700">
                  + Create Interview
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-violet-600">
                  {stat.value}
                </h2>
              </div>
            ))}
          </div>

                    <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Recent Interviews
            </h2>

            {dashboard.recentInterviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">

                <h3 className="text-xl font-semibold text-slate-800">
                  No interviews yet
                </h3>

                <p className="mt-2 text-slate-500">
                  Create your first AI interview and start tracking your
                  progress.
                </p>

                <Link href="/interviews/new">
                  <Button className="mt-6 bg-violet-600 hover:bg-violet-700">
                    Create Interview
                  </Button>
                </Link>

              </div>
            ) : (
              <div className="space-y-4">

                {dashboard.recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {interview.title}
                      </h3>

                      <p className="text-slate-500">
                        {interview.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          interview.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {interview.status}
                      </span>

                      {interview.status === "COMPLETED" ? (
                        <>
                          <span className="font-semibold">
                            {interview.overallScore?.toFixed(1) ?? "0.0"}/10
                          </span>

                          <Link href={`/results/${interview.id}`}>
                            <Button variant="outline">
                              View Results
                            </Button>
                          </Link>

                          <AlertDialog>

                            <AlertDialogTrigger
                              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogTrigger>

                            <AlertDialogContent>

                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Interview?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently
                                  delete the interview and all of its questions,
                                  answers, and AI evaluation.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>

                                <AlertDialogCancel>
                                  Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={() => handleDelete(interview.id)}
                                >
                                  Delete
                                </AlertDialogAction>

                              </AlertDialogFooter>

                            </AlertDialogContent>

                          </AlertDialog>

                        </>
                      ) : (
                        <>

                          <Link href={`/interviews/${interview.id}`}>
                            <Button>
                              Continue
                            </Button>
                          </Link>

                          <AlertDialog>

                            <AlertDialogTrigger
                              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogTrigger>

                            <AlertDialogContent>

                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Interview?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently
                                  delete the interview and all of its questions,
                                  answers, and AI evaluation.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>

                                <AlertDialogCancel>
                                  Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={() => handleDelete(interview.id)}
                                >
                                  Delete
                                </AlertDialogAction>

                              </AlertDialogFooter>

                            </AlertDialogContent>

                          </AlertDialog>

                        </>
                      )}

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}