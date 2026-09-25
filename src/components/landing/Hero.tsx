import { ArrowRight, CalendarCheck, FileSearch, ShieldCheck, Sparkles, CheckCircle, Activity, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboard from "@/assets/dashboard.jpg";

const proof = [
  { icon: FileSearch, text: "AI-Powered Permit Extraction" },
  { icon: CalendarCheck, text: "Automated Regulatory Deadlines" },
  { icon: ShieldCheck, text: "Audit-Ready Evidence Vault" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-emerald-500/15 bg-gradient-to-b from-emerald-50/70 via-background to-background py-16 sm:py-24">
      {/* Dynamic ambient glowing background orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-gradient-to-tr from-emerald-400/20 via-teal-300/15 to-transparent blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-2xl animate-float" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {/* Eco Sustainability Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-800 backdrop-blur-md animate-badge-pulse">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Eco-Smart EHS Compliance Platform</span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Turn complex permits into an{" "}
              <span className="text-gradient-eco">actionable compliance plan</span>.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              <strong className="font-semibold text-foreground">Logivra</strong> automatically reads environmental permits, Title V rules, and discharge standards—transforming dense PDFs into trackable tasks with assigned owners, proactive deadlines, and tamper-proof evidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="btn-dynamic h-12 px-7 text-base bg-brand-gradient text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35">
                <a href="#demo" className="flex items-center gap-2">
                  Request Platform Demo
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="btn-dynamic h-12 border-emerald-600/30 px-6 text-base text-foreground hover:bg-emerald-500/10 hover:border-emerald-600/50"
              >
                <a href="#simulator" className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                  Try Interactive Simulator
                </a>
              </Button>
            </div>

            {/* Micro value props with green checks */}
            <ul className="mt-10 grid gap-3 sm:grid-cols-3">
              {proof.map((p) => (
                <li key={p.text} className="flex items-start gap-2.5 rounded-xl border border-emerald-500/15 bg-white/70 p-2.5 backdrop-blur-sm shadow-xs dark:bg-emerald-950/20">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700">
                    <p.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-medium text-foreground">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive visual mockup container */}
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 opacity-70 blur-xl transition-all duration-500 group-hover:opacity-100" />
            
            <div className="relative rounded-2xl border border-emerald-500/25 bg-background/90 p-2 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border/80 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground">app.logivra.com/obligations</span>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <Activity className="h-3 w-3 animate-pulse text-emerald-600" /> Live Sync
                </span>
              </div>

              <img
                src={dashboard}
                alt="Logivra environmental compliance dashboard listing obligations, deadlines, and audit evidence"
                width={1600}
                height={1104}
                className="w-full rounded-xl border border-border/60 object-cover"
              />

              {/* Dynamic floating status card */}
              <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 rounded-2xl border border-emerald-500/30 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:bg-slate-900/95 animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">EPA Title V Audit Passed</p>
                    <p className="text-[11px] text-muted-foreground">148 obligations verified • 0 findings</p>
                  </div>
                </div>
              </div>

              {/* Dynamic floating metric card */}
              <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 rounded-2xl border border-emerald-500/30 bg-white/95 p-3 shadow-xl backdrop-blur-md dark:bg-slate-900/95">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-700 font-bold text-xs">
                    42h
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-foreground">Time Saved / Mo</p>
                    <p className="text-[10px] text-emerald-700">Automated PDF Parsing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
