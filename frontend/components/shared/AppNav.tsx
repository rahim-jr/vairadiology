"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icons";

const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/tasks", label: "Tasks", icon: "clipboard" },
  { href: "/annotate", label: "Annotate", icon: "polygon" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <Link href="/tasks" className="logo" aria-label="VAI Workbench home">
        <span className="logo-mark" />
        <span>VAI Workbench</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            className={`nav-link${pathname.startsWith(link.href) ? " active" : ""}`}
            href={link.href}
          >
            <Icon name={link.icon} size={17} /> {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
