"use client";

import Logo from "./Logo";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  User,
  LogOut,
} from "lucide-react";

const items = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "New Interview",
    icon: PlusCircle,
  },
  {
    title: "History",
    icon: History,
  },
  {
    title: "Profile",
    icon: User,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen w-64 border-r bg-background flex-col">
      <div className="p-6">
        <Logo />
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.title}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-accent transition"
          >
            <item.icon size={18} />
            {item.title}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 transition">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}