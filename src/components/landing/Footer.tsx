import { GreenUdyogLogo } from "@/components/landing/GreenUdyogLogo";

const groups = [
  {
    title: "Platform",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Security", href: "#trust" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Emissions focus",
    links: [
      { label: "Stack & air consent", href: "#who" },
      { label: "Carbon & fuel records", href: "#who" },
      { label: "Monitoring & testing", href: "#features" },
      { label: "Regulator readiness", href: "#trust" },
    ],
  },
  {
    title: "Get started",
    links: [{ label: "Free consultation", href: "#demo" }],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <GreenUdyogLogo className="h-10 w-10" showWordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Affordable online support for Indian MSMEs on carbon, stack emissions, and related air
              pollutants — so government scrutiny does not catch you unprepared.
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
            © {new Date().getFullYear()} GreenUdyog. Information is not legal advice.
          </p>
          <p className="text-xs text-muted-foreground">Made for India · Times in IST</p>
        </div>
      </div>
    </footer>
  );
}
