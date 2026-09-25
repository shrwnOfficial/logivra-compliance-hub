import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Platform" },
  { href: "#simulator", label: "Live Scanner" },
  { href: "#calculator", label: "ROI Calculator" },
  { href: "#who", label: "Industries" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-500/15 bg-background/80 backdrop-blur-lg transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Leaf className="h-5 w-5 stroke-[2.2]" />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-emerald-700">
              Logivra
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Compliance Hub
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-emerald-700 hover:translate-y-[-1px]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Button asChild className="btn-dynamic bg-brand-gradient text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30">
            <a href="#demo">Book a Demo</a>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 text-foreground transition-colors hover:bg-emerald-500/10 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-emerald-500/15 bg-background/95 px-5 py-4 shadow-xl backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col space-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Button asChild className="btn-dynamic w-full bg-brand-gradient text-white">
                <a href="#demo" onClick={() => setOpen(false)}>
                  Book a Demo
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
