"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IconSparkles } from "@tabler/icons-react";

import { createInterview } from "@/services/interview.service";

export default function NewInterviewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [techStack, setTechStack] = useState("");
  const [questions, setQuestions] = useState("");

  const handleCreateInterview = async () => {
    if (
      !title ||
      !role ||
      !experience ||
      !techStack ||
      !questions
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const interview = await createInterview({
        title,
        role,
        experienceLevel: experience,
        techStack,
        totalQuestions: Number(questions),
      });

      router.push(`/interviews/${interview.id}`);

    } catch (error) {
      console.error(error);
      alert("Failed to create interview.");
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-8 py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900">
              Create New Interview
            </h1>

            <p className="mt-2 text-slate-500">
              Configure your interview and let AI generate personalized questions.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Interview Title</Label>

                <Input
                  className="mt-2 h-12 rounded-xl"
                  placeholder="Frontend Developer Interview"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Job Role</Label>

                <Input
                  className="mt-2 h-12 rounded-xl"
                  placeholder="Frontend Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div>
                <Label>Experience Level</Label>

                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4"
                >
                  <option value="">Select experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 Years">1–3 Years</option>
                  <option value="3-5 Years">3–5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              <div>
                <Label>Tech Stack</Label>

                <Input
                  className="mt-2 h-12 rounded-xl"
                  placeholder="React, Node.js, PostgreSQL"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
              </div>

              <div>
                <Label>Number of Questions</Label>

                <select
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4"
                >
                  <option value="">Select questions</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                onClick={handleCreateInterview}
                className="h-12 rounded-xl bg-violet-600 px-8 hover:bg-violet-700"
              >
                <IconSparkles className="mr-2" size={18} />
                Generate Interview
              </Button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}