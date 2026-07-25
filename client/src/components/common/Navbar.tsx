import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold">
          Welcome back 👋
        </h2>

        <p className="text-sm text-muted-foreground">
          Ready to ace your next interview?
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />

        <Avatar>
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}