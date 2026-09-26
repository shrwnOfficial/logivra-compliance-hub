import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  Faq,
  Features,
  HowItWorks,
  Problem,
  Trust,
  WhoItsFor,
} from "@/components/landing/Sections";
import { BookFreeCall } from "@/components/landing/BookFreeCall";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

const title = "Sankalp — Compliance mapped from your paperwork";
const description =
  "Environmental and safety compliance for Indian small and medium manufacturers. Understand permit requirements before regulatory action — book a free document review.";

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
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <ScrollReveal scale>
          <Problem />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal>
          <WhoItsFor />
        </ScrollReveal>
        <ScrollReveal scale delay={0.05}>
          <Features />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <Trust />
        </ScrollReveal>
        <ScrollReveal>
          <Faq />
        </ScrollReveal>
        <ScrollReveal scale>
          <BookFreeCall />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
