"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Sky" },
  { href: "/events", label: "Events" },
  { href: "/visit", label: "Visit" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 px-6 py-3 bg-gradient-to-b from-[#04050c]/95 via-[#04050c]/70 to-transparent">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link href="/" className="font-light tracking-[0.4em] text-xs uppercase text-neutral-200">
          Nocturne
        </Link>
        <nav className="flex gap-5">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={(active ? "text-neutral-100" : "text-neutral-400 hover:text-neutral-100") + " text-[10px] uppercase tracking-[0.25em] transition-colors"}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
