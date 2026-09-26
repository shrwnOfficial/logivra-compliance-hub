import { SankalpLogo, BRAND } from "@/components/landing/SankalpLogo";

const groups = [
  {
    title: "Platform",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Security", href: "#trust" },
      { label: "Common questions", href: "#faq" },
    ],
  },
  {
    title: "Compliance",
    links: [
      { label: "Environmental permits", href: "#who" },
      { label: "Safety & labour", href: "#who" },
      { label: "Monitoring & renewals", href: "#features" },
      { label: "Regulator readiness", href: "#trust" },
    ],
  },
  {
    title: "Get started",
    links: [{ label: "Book my review", href: "#demo" }],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <SankalpLogo className="h-10 w-10" showWordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {BRAND.name} helps Indian small and medium manufacturers turn consents, licenses, and safety obligations into a
              plan they can track before regulators or buyers come asking.
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold text-foreground">{g.title}</h3>
              <ul className="mt-4 space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.name}. Information is not legal advice.
          </p>
          <p className="text-xs text-muted-foreground">Made for India · Times in India Standard Time</p>
        </div>
      </div>
    </footer>
  );
}
