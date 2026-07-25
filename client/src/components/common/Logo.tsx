import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
        <Sparkles size={20} />
      </div>

      <div>
        <h1 className="text-lg font-bold tracking-tight">
          AI Interview
        </h1>

        <p className="text-xs text-muted-foreground">
          Platform
        </p>
      </div>
    </Link>
  );
}