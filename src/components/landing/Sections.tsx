import {
  AlarmClock,
  BellRing,
  Building2,
  ClipboardList,
  Factory,
  FileStack,
  FolderCheck,
  Gauge,
  Lock,
  Flame,
  ScanLine,
  ServerCog,
  Share2,
  Users,
  Wind,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import permit from "@/assets/permit.jpg";
import facility from "@/assets/facility.jpg";
import { ScrollRevealStagger, ScrollRevealItem } from "@/components/landing/ScrollReveal";

function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export function Problem() {
  const pains = [
    {
      icon: FileStack,
      title: "Emission limits buried in consent PDFs",
      body: "Your CTO may list mg/Nm³ caps for PM, SO₂, NOx, or other parameters across dozens of pages. MSME teams often discover a limit only after a test fails or a notice arrives.",
    },
    {
      icon: AlarmClock,
      title: "Monitoring dates slip on busy shop floors",
      body: "Stack testing, continuous monitoring, and fuel or production logs are easy to defer. Missed cycles are a common reason SPCB and CPCB teams escalate scrutiny.",
    },
    {
      icon: FolderCheck,
      title: "No single picture of carbon and air risk",
      body: "Fuel bills, DG run-hours, lab reports, and buyer ESG forms live in different places. When government or a large customer asks, assembling proof becomes a fire drill.",
    },
  ];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="The problem"
          title="Small plants face big scrutiny on what they emit"
          description="Carbon and air pollution are on every regulator’s radar. You should not need a ₹15 lakh consultant to know what could bring enforcement to your gate."
        />
        <ScrollRevealStagger className="mt-12 grid gap-5 md:grid-cols-3">
          {pains.map((p) => (
            <ScrollRevealItem
              key={p.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-shadow duration-300 hover:shadow-md hover:shadow-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      icon: ScanLine,
      step: "01",
      title: "Upload air & energy documents",
      body: "Share your CTO, stack monitoring reports, fuel and electricity records, and any SPCB or CPCB notices — digital or scanned.",
    },
    {
      icon: ClipboardList,
      step: "02",
      title: "Map limits, tests, and carbon drivers",
      body: "Each emission clause, monitoring frequency, and key fuel or process source becomes a tracked obligation with the source text attached.",
    },
    {
      icon: BellRing,
      step: "03",
      title: "Act before scrutiny turns into penalties",
      body: "Reminders before tests and filings, a place to log readings and fuel data, and exportable packs when inspectors or buyers ask.",
    },
  ];

  return (
    <section id="how-it-works" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              center={false}
              eyebrow="How it works"
              title="From stack consent to emissions you can defend"
              description="Three steps — for MSMEs with boilers, furnaces, DG sets, or processes that put them on an SPCB air consent."
            />
            <ScrollRevealStagger className="mt-10 space-y-5" stagger={0.1}>
              {steps.map((s) => (
                <ScrollRevealItem
                  key={s.step}
                  className="flex gap-4 rounded-2xl border border-border bg-background p-5 transition-shadow duration-300 hover:shadow-md hover:shadow-primary/5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-muted-foreground">
                      STEP {s.step}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>
          </div>

          <div className="rounded-2xl border border-border bg-background p-2">
            <img
              src={permit}
              alt="Air consent documents next to a laptop showing emission limits and monitoring tasks"
              loading="lazy"
              width={1408}
              height={1008}
              className="w-full rounded-xl border border-border object-cover"
            />
            <div className="p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every obligation links back to the exact clause it came from, so your team can check
                the wording without opening the original file.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: Wind,
      title: "Stack & air consent mapping",
      body: "Turn CTO clauses into tasks for emission limits, control equipment, and parameters your board cares about.",
    },
    {
      icon: Flame,
      title: "Carbon & fuel visibility",
      body: "Track fuels, DG hours, and energy use alongside air duties so carbon questions do not surprise you later.",
    },
    {
      icon: BellRing,
      title: "Monitoring calendar",
      body: "Alerts before stack tests, CEMS checks, and periodic reports tied to your consent.",
    },
    {
      icon: FolderCheck,
      title: "Lab & reading archive",
      body: "Attach stack reports, calibration records, and exceedance follow-ups to the obligation they satisfy.",
    },
    {
      icon: Gauge,
      title: "Plant & multi-site view",
      body: "See which stacks or units are green, due soon, or at risk — without rebuilding spreadsheets.",
    },
    {
      icon: Share2,
      title: "Inspection & buyer packs",
      body: "Export evidence for SPCB visits, NCAP-related asks, or customer carbon and ESG questionnaires.",
    },
  ];

  return (
    <section id="features" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Platform"
          title="Built around what regulators measure in the air"
          description="Grounded in India’s Air Act, CPCB emission standards, and SPCB consent practice — focused on carbon drivers and air pollutants, not US federal law."
        />
        <ScrollRevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <ScrollRevealItem
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}

export function WhoItsFor() {
  const roles = [
    { icon: Users, label: "Plant heads answering to the board" },
    { icon: Factory, label: "Foundries, metals & auto components" },
    { icon: Building2, label: "Units in notified industrial areas" },
    { icon: Wind, label: "Stacks with PM, SO₂, NOx limits" },
    { icon: Flame, label: "Boilers, furnaces & DG sets" },
    { icon: Gauge, label: "Teams asked for carbon / ESG data" },
  ];

  return (
    <section id="who" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 overflow-hidden rounded-2xl border border-border lg:order-1">
            <img
              src={facility}
              alt="Clean modern manufacturing facility with stainless steel process equipment"
              loading="lazy"
              width={1600}
              height={1104}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              center={false}
              eyebrow="Who it's for"
              title="For plants where emissions draw government attention"
              description="GreenUdyog fits Udyam MSMEs with air consent, periodic stack testing, and rising pressure on carbon and pollution — without a full EHS desk."
            />
            <ScrollRevealStagger className="mt-8 grid gap-3 sm:grid-cols-2" stagger={0.06}>
              {roles.map((r) => (
                <ScrollRevealItem
                  key={r.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-primary/40"
                >
                  <r.icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{r.label}</span>
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Trust() {
  const items = [
    {
      icon: Lock,
      title: "Your documents stay yours",
      body: "Data is encrypted in transit and at rest. We do not sell or share your files.",
    },
    {
      icon: ServerCog,
      title: "Access you control",
      body: "Role-based permissions and single sign-on keep site data with the people who need it.",
    },
    {
      icon: FolderCheck,
      title: "Full activity history",
      body: "Every change to an obligation is logged, so you can show what happened and when.",
    },
  ];

  return (
    <section id="trust" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Security"
          title="Built for records you cannot afford to lose"
          description="Stack reports, fuel data, and consent files stay confidential. GreenUdyog treats them that way."
        />
        <ScrollRevealStagger className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((i) => (
            <ScrollRevealItem
              key={i.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-shadow duration-300 hover:shadow-md hover:shadow-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
                <i.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{i.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.body}</p>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}

export function Faq() {
  const faqs = [
    {
      q: "We are a small unit — can the government still scrutinise our emissions?",
      a: "Yes. If you have an air consent (CTE/CTO), use boilers, furnaces, or DG sets, or fall in a polluted industrial cluster, SPCB and CPCB can ask for stack data, monitoring reports, and proof you are within limits. Size does not remove scrutiny — weak records do increase it. On a free call we help you see your exposure.",
    },
    {
      q: "What air pollutants usually trigger action in India?",
      a: "Common focus areas are particulate matter (PM), sulphur dioxide (SO₂), nitrogen oxides (NOx), and sometimes VOCs or industry-specific parameters — all often capped in your consent in mg/Nm³. Exceedances, missing tests, or visible fugitive dust can lead to notices, directions, or closure threats depending on your state board.",
    },
    {
      q: "Do MSMEs need to worry about carbon emissions?",
      a: "Routine SPCB consent is still about permitted air pollutants, but carbon shows up through fuel use, electricity, and buyer supply-chain questionnaires. Large OEMs and export customers increasingly ask MSME suppliers for energy and emissions information even when full carbon accounting is not yet mandatory for you.",
    },
    {
      q: "What happens if we exceed a stack limit on a lab report?",
      a: "You may need to inform the board, explain the cause, show corrective action, and re-test. Repeat or serious exceedances raise enforcement risk. We help you tie each limit in your CTO to a monitoring plan and a paper trail if something goes wrong.",
    },
    {
      q: "How often must we test stack emissions?",
      a: "Frequency is in your consent and CPCB/SPCB sector guidelines — monthly, quarterly, six-monthly, or annual depending on industry and parameter. Missing a cycle is one of the most common findings in inspections. We convert those lines into a calendar your team can run.",
    },
    {
      q: "Our DG set runs only during power cuts — does it still count?",
      a: "Often yes for consent and fuel records if it is listed as a source or uses diesel above thresholds your state cares about. Boards may ask for stack or noise data and fuel logs. We clarify what your consent and local rules expect for backup generators.",
    },
    {
      q: "What is NCAP and does it affect our factory?",
      a: "The National Clean Air Programme pushes states to improve air quality in non-attainment and nearby industrial areas. That can mean tighter local action, more monitoring, and attention to MSME stacks in hotspot cities. If you operate in or supply plants in those regions, scrutiny can intensify even without a change in your CTO.",
    },
    {
      q: "A buyer sent a carbon or ESG form — can you help?",
      a: "Yes. Many MSMEs must report fuel, electricity, and basic emissions-related data to customers without a sustainability team. We help you map consent limits, monitoring results, and energy records into answers you can stand behind.",
    },
    {
      q: "Is the online consultation free? What should we bring?",
      a: "Yes — 30 minutes at no cost. Bring your latest air CTO (if any), recent stack or ambient reports, rough fuel and DG usage, and your state and district. PDFs or photos are enough for a first conversation.",
    },
    {
      q: "Are you the pollution board or a law firm?",
      a: "Neither. GreenUdyog is affordable emissions and compliance support for MSMEs — not SPCB/CPCB and not legal counsel. For court cases, contested shutdown orders, or formal submissions you may still need a qualified consultant or advocate in your state.",
    },
  ];

  return (
    <section id="faq" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions MSME owners ask about emissions"
          description="Straight answers on stack limits, carbon pressure, and government scrutiny — book a free call if yours is not listed."
        />
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium text-foreground">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function SocialProof() {
  const quotes = [
    {
      quote:
        "After a stack exceedance notice, we finally had one place for limits, lab reports, and follow-up tasks.",
      role: "Plant Head, foundry MSME, Maharashtra",
    },
    {
      quote:
        "Our OEM asked for energy and emissions data we had never tracked. GreenUdyog helped us start without a big consultancy.",
      role: "Operations lead, auto components, Chennai",
    },
    {
      quote:
        "Stack monitoring dates used to live in someone's diary. Now the whole team sees what SPCB expects.",
      role: "Proprietor, metal fabrication, Gujarat",
    },
  ];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Trusted by MSME teams"
          title="Built for plants under the emissions microscope"
          description="Stories from Indian MSMEs getting ahead of air-pollution and carbon questions."
        />
        <ScrollRevealStagger className="mt-12 grid gap-5 md:grid-cols-3">
          {quotes.map((q) => (
            <ScrollRevealItem
              key={q.role}
              className="rounded-2xl border border-border bg-surface p-6 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
            >
              <blockquote>
                <p className="text-sm leading-relaxed text-foreground">&ldquo;{q.quote}&rdquo;</p>
                <footer className="mt-4 text-xs text-muted-foreground">{q.role}</footer>
              </blockquote>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}
