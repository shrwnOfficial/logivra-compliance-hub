import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  Faq,
  Features,
  HowItWorks,
  Problem,
  SocialProof,
  Trust,
  WhoItsFor,
} from "@/components/landing/Sections";
import { BookFreeCall } from "@/components/landing/BookFreeCall";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

const title = "GreenUdyog — Emissions clarity for small manufacturers";
const description =
  "Help Indian MSMEs track carbon and air pollution — stack limits, PM and GHG-related duties, and SPCB/CPCB scrutiny — book a free consultation.";

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
        <ScrollReveal scale delay={0.05}>
          <Features />
        </ScrollReveal>
        <ScrollReveal>
          <WhoItsFor />
        </ScrollReveal>
        <ScrollReveal scale>
          <SocialProof />
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
