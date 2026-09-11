import { Activity, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const navigation = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-zinc-950 text-zinc-100">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md text-base font-semibold tracking-tight transition-colors hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-emerald-400 text-zinc-950 transition-colors group-hover:bg-emerald-300">
            <Activity aria-hidden="true" size={18} strokeWidth={2.5} />
          </span>
          <span>DevPulse</span>
        </Link>

        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/4 p-1">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:px-3.5"
            >
              <Icon aria-hidden="true" size={16} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}