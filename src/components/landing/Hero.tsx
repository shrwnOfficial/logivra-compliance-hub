import { ArrowRight, CalendarCheck, FileSearch, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import dashboard from "@/assets/dashboard.jpg";

const proof = [
  { icon: FileSearch, text: "Stack limits & emission clauses mapped" },
  { icon: CalendarCheck, text: "Free call on carbon & air scrutiny" },
  { icon: ShieldCheck, text: "Proof ready for SPCB / CPCB checks" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden border-b border-border bg-surface-gradient">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary-deep">
              GreenUdyog — Emissions clarity for small manufacturers
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
              Stay ahead of carbon and air-pollution scrutiny.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Indian MSMEs face tighter watch on stack emissions, fuel use, and pollutants like PM,
              SO₂, NOx, and VOCs — plus growing pressure on carbon and energy data. Turn your CTO
              and monitoring duties into a clear plan without a full-time consultant.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="cta" className="shadow-md">
                <a href="#demo">
                  Book a free online call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="cta" variant="outline" className="border-border">
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {proof.map((p, i) => (
                <motion.li
                  key={p.text}
                  className="flex items-start gap-2"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.08 }}
                >
                  <p.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{p.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-border bg-background p-2 shadow-lg shadow-primary/10"
            initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease, delay: 0.12 }}
          >
            <img
              src={dashboard}
              alt="GreenUdyog dashboard showing emission limits, monitoring dates, and compliance tasks"
              width={1600}
              height={1104}
              className="w-full rounded-xl border border-border"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
