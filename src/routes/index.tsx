import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  Faq,
  Features,
  FinalCta,
  HowItWorks,
  Problem,
  Trust,
  WhoItsFor,
  LiveScannerSimulator,
  ComplianceCalculator,
} from "@/components/landing/Sections";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { ScrollAtmosphere } from "@/components/landing/ScrollAtmosphere";

const title = "Logivra — Automated Environmental & EHS Compliance Platform";
const description =
  "Logivra automatically extracts deadlines, operating limits, and monitoring tasks from your facility permits so you never miss a reporting date or face an environmental fine.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500 selection:text-white">
      <ScrollAtmosphere />
      <ScrollProgressBar />

      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />

          <ScrollReveal direction="up" threshold={0.1} delay={40}>
            <Problem />
          </ScrollReveal>

          <ScrollReveal direction="up" threshold={0.12} delay={60}>
            <HowItWorks />
          </ScrollReveal>

          <ScrollReveal direction="zoom" threshold={0.1} delay={80}>
            <LiveScannerSimulator />
          </ScrollReveal>

          <ScrollReveal direction="up" threshold={0.12} delay={60}>
            <Features />
          </ScrollReveal>

          <ScrollReveal direction="zoom" threshold={0.1} delay={80}>
            <ComplianceCalculator />
          </ScrollReveal>

          <ScrollReveal direction="up" threshold={0.12} delay={60}>
            <WhoItsFor />
          </ScrollReveal>

          <ScrollReveal direction="up" threshold={0.12} delay={60}>
            <Trust />
          </ScrollReveal>

          <ScrollReveal direction="up" threshold={0.12} delay={60}>
            <Faq />
          </ScrollReveal>

          <ScrollReveal direction="zoom" threshold={0.1} delay={80}>
            <FinalCta />
          </ScrollReveal>
        </main>
        <Footer />
      </div>
    </div>
  );
}
