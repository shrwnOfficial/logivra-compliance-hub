import { Leaf, ShieldCheck, ArrowUp } from "lucide-react";

const groups = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Live Permit Scanner", href: "#simulator" },
      { label: "ROI Calculator", href: "#calculator" },
      { label: "Obligation Register", href: "#features" },
      { label: "Security & Trust", href: "#trust" },
    ],
  },
  {
    title: "Permit Programs",
    links: [
      { label: "Title V Clean Air Act", href: "#who" },
      { label: "NPDES Wastewater", href: "#who" },
      { label: "RCRA Hazardous Waste", href: "#who" },
      { label: "SPCC Spill Plans", href: "#who" },
      { label: "Multi-Site Portfolios", href: "#who" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Request Platform Demo", href: "#demo" },
      { label: "FAQ", href: "#faq" },
      { label: "Privacy Policy", href: "#demo" },
      { label: "Terms of Service", href: "#demo" },
    ],
  },
];

export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="border-t border-emerald-500/15 bg-gradient-to-b from-background to-emerald-950/10">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-emerald-500/20">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Logivra
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Intelligent environmental compliance platform. Automatically turns complex permits, regulations, and reports into trackable tasks with assigned owners and audit-ready proof.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>SOC2 Type II & Enterprise Encryption Standard</span>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {g.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-emerald-700"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Logivra Technologies Inc. All rights reserved. Dedicated to manufacturing compliance & sustainability.
          </p>
          <div className="flex items-center gap-5">
            <a href="#demo" className="text-xs text-muted-foreground hover:text-emerald-700">
              Privacy Policy
            </a>
            <a href="#demo" className="text-xs text-muted-foreground hover:text-emerald-700">
              Terms of Service
            </a>
            <button
              onClick={scrollToTop}
              className="btn-dynamic flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
