import {
  AlarmClock,
  BellRing,
  ClipboardList,
  FileStack,
  FolderCheck,
  Gauge,
  Lock,
  Flame,
  ScanLine,
  ServerCog,
  Share2,
  Globe2,
  AlertTriangle,
  Briefcase,
  Scale,
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
      title: "Your obligations are buried in paperwork, not tracked anywhere",
      body: "Consents, licenses, and authorizations list limits, conditions, and renewal dates across dozens of pages. Most small and medium enterprise teams only discover one after a report fails or a notice arrives.",
    },
    {
      icon: AlarmClock,
      title: "Compliance dates slip on busy shop floors",
      body: "Testing, monitoring, inspections, and renewals are easy to defer when production takes priority. Missed cycles are one of the most common reasons regulators escalate scrutiny.",
    },
    {
      icon: FolderCheck,
      title: "No single picture of where you stand",
      body: "Permits, monitoring logs, lab reports, and buyer questionnaires all live in different places. When a regulator or customer asks for proof, pulling it together becomes a fire drill.",
    },
    {
      icon: Scale,
      title: "Non-compliance carries real consequences",
      body: "Missed or breached conditions can mean penalties, show-cause notices, or escalation toward closure — most of it avoidable with a system that tracks what you are already obligated to do.",
    },
  ];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="The problem"
          title="Small plants face the same scrutiny as large ones"
          description="Regulators do not distinguish by size when it comes to compliance — environmental, safety, or labour. You should not need a ₹15 lakh consultant to know what could bring enforcement to your gate."
        />
        <ScrollRevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      title: "Submit your documentation",
      body: "Share consents, licenses, safety records, and past regulator correspondence — digital or scanned.",
    },
    {
      icon: ClipboardList,
      step: "02",
      title: "Get a structured obligation list",
      body: "Each requirement becomes a tracked task with the source paragraph attached, plus frequency, due date, and suggested owner.",
    },
    {
      icon: BellRing,
      step: "03",
      title: "Stay ahead of every date",
      body: "Reminders before work is due, proof logged as it happens, and exportable packs when inspectors or buyers ask.",
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
              title="From your paperwork to a compliance plan you can run"
              description="Three steps — for small and medium manufacturers managing environmental, safety, and labour duties without a full-time compliance desk."
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
              alt="Permit documents next to a laptop showing compliance tasks and deadlines"
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
      icon: FileStack,
      title: "Consent & permit mapping",
      body: "Turn Consent to Establish and Consent to Operate conditions, water pollution consents, and hazardous waste authorizations into tasks for limits, control equipment, and parameters your board cares about.",
    },
    {
      icon: Flame,
      title: "Carbon & fuel visibility",
      body: "Track fuel use, diesel generator run-hours, and electricity alongside your environmental duties, so carbon and buyer sustainability questionnaires do not surprise you later.",
    },
    {
      icon: BellRing,
      title: "Monitoring calendar",
      body: "Alerts before tests, inspections, and periodic filings tied to every consent and license you hold.",
    },
    {
      icon: FolderCheck,
      title: "Laboratory report archive",
      body: "Attach stack reports, effluent tests, calibration records, and exceedance follow-ups to the obligation they satisfy.",
    },
    {
      icon: Gauge,
      title: "Plant & multi-site view",
      body: "See which sites or units are green, due soon, or at risk — without rebuilding spreadsheets.",
    },
    {
      icon: Share2,
      title: "Inspection & buyer packs",
      body: "Export evidence for State Pollution Control Board or factory inspector visits, or customer carbon and sustainability questionnaires.",
    },
  ];

  return (
    <section id="features" className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Platform"
          title="Built around what your permits actually require"
          description="Grounded in Indian environmental, safety, and labour law — covering air, water, waste, and growing buyer expectations on carbon and sustainability data, not just one regulation."
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

const ALSO_FIT_PILLS = [
  "Hold air, water, or hazardous waste pollution consent",
  "Run boilers, furnaces, diesel generators, or an effluent treatment plant",
  "Have no dedicated environment, health and safety team",
];

export function WhoItsFor() {
  const segments = [
    {
      icon: Globe2,
      label: "Buyer-driven exporters",
      line: "Getting carbon or sustainability questionnaires from large original equipment manufacturers and export buyers.",
    },
    {
      icon: AlertTriangle,
      label: "Already-flagged plants",
      line: "Had a notice, exceedance, or inspection and cannot risk a repeat.",
    },
    {
      icon: Briefcase,
      label: "Compliance consultants",
      line: "Managing compliance across multiple client plants.",
    },
  ];

  return (
    <section id="who" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Who it's for"
          title="For plants where compliance draws government or buyer attention"
          description="Sankalp fits manufacturers answering to buyers on sustainability data, recovering from a pollution board notice or inspection, or simply running without a full-time environment and safety desk. If any of this sounds familiar, you are exactly who we built this for."
        />
        <ScrollRevealStagger className="mt-12 grid gap-5 md:grid-cols-3">
          {segments.map((s) => (
            <ScrollRevealItem
              key={s.label}
              className="rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-primary/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{s.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.line}</p>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
        <div className="mt-10">
          <p className="text-center text-sm font-medium text-foreground">Also a fit if you:</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {ALSO_FIT_PILLS.map((pill) => (
              <li
                key={pill}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-border">
          <img
            src={facility}
            alt="Modern manufacturing facility"
            loading="lazy"
            width={1600}
            height={1104}
            className="h-48 w-full object-cover sm:h-64"
          />
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
          description="Permits, monitoring data, and safety records stay confidential. Sankalp treats them that way."
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
      q: "We are a small factory — do we still need pollution board consent?",
      a: "Often yes, if you discharge effluent, emit air pollutants, handle hazardous waste, or use fuel in boilers or generators. Many small and medium enterprises need Consent to Establish before setup and Consent to Operate before running, issued by your State Pollution Control Board. It depends on your process and your state's Red, Orange, Green, or White categorisation. On a free call we help you check what applies to your unit.",
    },
    {
      q: "We are a small unit — can the government still scrutinise our emissions?",
      a: "Yes. If you hold air pollution consent, use boilers, furnaces, or diesel generators, or operate in a polluted industrial cluster, your State Pollution Control Board and the Central Pollution Control Board can ask for chimney stack data, monitoring reports, and proof you are within limits. Plant size does not remove scrutiny — weak records do increase it. On a free call we help you see your exposure.",
    },
    {
      q: "What air pollutants usually trigger action in India?",
      a: "Regulators often focus on particulate matter (fine dust in stack air), sulphur dioxide, nitrogen oxides, and sometimes volatile organic compounds or industry-specific parameters — limits are usually written in your consent order. Exceedances, missed tests, or visible fugitive dust can lead to notices, directions, or closure threats depending on your state board.",
    },
    {
      q: "Do small manufacturers need to worry about carbon emissions?",
      a: "Routine pollution board consent is still about permitted air and water pollutants, but carbon shows up through fuel use, electricity, and buyer supply-chain questionnaires. Large vehicle and machinery buyers and export customers increasingly ask small suppliers for energy and emissions information even when full carbon accounting is not yet mandatory for you.",
    },
    {
      q: "What happens if we exceed a stack limit on a lab report?",
      a: "You may need to inform the pollution board, explain the cause, show corrective action, and re-test. Repeat or serious exceedances raise enforcement risk. We help you tie each limit in your Consent to Operate to a monitoring plan and a paper trail if something goes wrong.",
    },
    {
      q: "How often must we test stack emissions?",
      a: "Frequency is written in your consent order and in Central and State Pollution Control Board sector guidelines — monthly, quarterly, six-monthly, or annual depending on industry and parameter. Missing a cycle is one of the most common findings in inspections. We convert those lines into a calendar your team can run.",
    },
    {
      q: "Our diesel generator runs only during power cuts — does it still count?",
      a: "Often yes for consent and fuel records if it is listed as a source or uses diesel above thresholds your state cares about. Boards may ask for stack or noise data and fuel logs. We clarify what your consent and local rules expect for backup generators.",
    },
    {
      q: "What is the National Clean Air Programme and does it affect our factory?",
      a: "The National Clean Air Programme is India's coordinated plan to improve air quality in cities and nearby industrial areas that do not meet standards. That can mean tighter local action, more monitoring, and more attention to small manufacturers' chimneys in hotspot cities. If you operate in or supply plants in those regions, scrutiny can intensify even without a change in your consent order.",
    },
    {
      q: "A buyer sent a carbon or sustainability form — can you help?",
      a: "Yes. Many small manufacturers must report fuel, electricity, and basic emissions-related data to customers without a sustainability team. We help you map consent limits, monitoring results, and energy records into answers you can stand behind.",
    },
    {
      q: "Is the online consultation free? What should we bring?",
      a: "Yes — 30 minutes at no cost. Bring your latest air Consent to Operate (if any), recent chimney stack or ambient air reports, rough fuel and diesel generator usage, and your state and district. Scanned documents or phone photos are enough for a first conversation.",
    },
    {
      q: "Are you the pollution board or a law firm?",
      a: "Neither. Sankalp is affordable compliance support for small and medium manufacturers — not a State or Central Pollution Control Board office and not legal counsel. For court cases, contested shutdown orders, or formal board submissions you may still need a qualified consultant or advocate in your state.",
    },
  ];

  return (
    <section id="faq" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Common questions"
          title="Questions small manufacturers ask us"
          description="Straight answers on permits, safety, stack limits, and carbon pressure — book a review if yours is not listed."
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

