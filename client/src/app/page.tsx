"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/services/dashboard.service";

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div className="p-10 text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <pre className="mt-8 rounded-lg bg-muted p-6 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}