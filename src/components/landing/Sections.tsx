import {
  AlarmClock,
  ArrowRight,
  BellRing,
  Building2,
  ClipboardList,
  Factory,
  FileStack,
  FolderCheck,
  Gauge,
  Lock,
  Recycle,
  ScanLine,
  ServerCog,
  Share2,
  Users,
  Droplets,
  Wind,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Sparkles,
  Calculator,
  ShieldCheck,
  TrendingDown,
  Layers,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import permit from "@/assets/permit.jpg";
import facility from "@/assets/facility.jpg";

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
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
        <Sparkles className="h-3 w-3 text-emerald-600" />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 1: THE PROBLEM
// -------------------------------------------------------------
export function Problem() {
  const pains = [
    {
      icon: FileStack,
      title: "Obligations Buried in 80-Page Permits",
      body: "A single air permit contains hundreds of specific operating limits, calibration frequencies, and reporting rules. Missing a single clause can trigger hefty fines.",
    },
    {
      icon: AlarmClock,
      title: "Fragile Spreadsheet Tracking",
      body: "Deadlines tracked on local Excel sheets fail when staff turns over. By the time someone notices a missed quarterly water test, you are already in non-compliance.",
    },
    {
      icon: FolderCheck,
      title: "Scattered Evidence During Audits",
      body: "When state or EPA inspectors arrive, proof of inspection is trapped across scattered email threads, paper binders, and personal desktop folders.",
    },
  ];

  return (
    <section className="relative border-b border-emerald-500/15 bg-background py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The Compliance Crisis"
          title="Manual permit tracking puts manufacturing facilities at risk"
          description="EHS managers bear legal and financial liability for missed deadlines. Traditional spreadsheets simply don't scale."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pains.map((p, idx) => (
            <div
              key={p.title}
              className="glass-card glass-card-hover group relative overflow-hidden rounded-3xl p-8 transition-all"
            >
              <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/15 transition-all" />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-bold text-foreground group-hover:text-emerald-700 transition-colors">
                {p.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 2: HOW IT WORKS
// -------------------------------------------------------------
export function HowItWorks() {
  const steps = [
    {
      icon: ScanLine,
      step: "01",
      title: "Upload Your Facility Permits",
      body: "Drag and drop any state, local, or federal environmental permit, consent decree, or renewal letter. Logivra processes both clean digital PDFs and scanned paper copies.",
    },
    {
      icon: ClipboardList,
      step: "02",
      title: "AI Parses Actionable Obligations",
      body: "Every requirement is isolated into an actionable task with its legal citation, exact snippet, frequency (daily, quarterly, annual), and designated plant owner.",
    },
    {
      icon: BellRing,
      step: "03",
      title: "Automate Monitoring & Evidence",
      body: "Receive proactive notifications before deadlines, log testing certificates, and generate audit-ready compliance packages in a single click.",
    },
  ];

  return (
    <section id="how-it-works" className="relative border-b border-emerald-500/15 bg-surface-gradient py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Workflow"
              title="From 100-page permits to a synchronized compliance engine"
              description="Deploy Logivra in hours. Most manufacturing facilities see their full obligation register ready within 48 hours."
            />
            <ol className="mt-10 space-y-4">
              {steps.map((s) => (
                <li
                  key={s.step}
                  className="glass-card group flex items-start gap-4 rounded-2xl p-5 transition-all hover:border-emerald-500/40 hover:translate-x-1"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-base shadow-sm">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-emerald-700 transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass-card relative overflow-hidden rounded-3xl p-3 shadow-2xl">
            <div className="overflow-hidden rounded-2xl border border-emerald-500/20">
              <img
                src={permit}
                alt="Environmental permit parsing in Logivra platform"
                loading="lazy"
                width={1408}
                height={1008}
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Citation Verification Guarantee</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Every extracted obligation is linked to the exact page, paragraph, and condition number in the original document for foolproof verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 3: LIVE INTERACTIVE SCANNER SIMULATOR (DYNAMIC FEATURE)
// -------------------------------------------------------------
type SampleDoc = {
  id: string;
  name: string;
  agency: string;
  type: string;
  excerpt: string;
  extractedTask: {
    title: string;
    citation: string;
    frequency: string;
    dueDate: string;
    owner: string;
    status: "Verified" | "Upcoming";
  };
};

const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: "air",
    name: "Title V Major Source Air Permit #A-9402",
    agency: "State Dept. of Environmental Protection",
    type: "Air Quality",
    excerpt:
      "Condition 4.2.1: The permittee shall perform quarterly calibration of all continuous opacity monitoring systems (COMS) in accordance with EPA Performance Specification 1. Results shall be maintained on-site for 5 years.",
    extractedTask: {
      title: "Quarterly COMS Opacity Sensor Calibration",
      citation: "Condition 4.2.1 • EPA Spec 1",
      frequency: "Quarterly",
      dueDate: "April 15, 2026",
      owner: "Lead Instrumentation Tech",
      status: "Verified",
    },
  },
  {
    id: "water",
    name: "NPDES Industrial Wastewater Discharge #GA-003819",
    agency: "EPA Region 4 Enforcement",
    type: "Clean Water Act",
    excerpt:
      "Section B, Item 3: Total Suspended Solids (TSS) and pH shall be sampled twice monthly at Outfall 001. A Discharge Monitoring Report (DMR) must be submitted electronically via NetDMR no later than the 28th of each month.",
    extractedTask: {
      title: "Submit NetDMR Monthly Discharge Report",
      citation: "Section B.3 • Outfall 001",
      frequency: "Monthly (28th)",
      dueDate: "March 28, 2026",
      owner: "Environmental Coordinator",
      status: "Upcoming",
    },
  },
  {
    id: "waste",
    name: "RCRA Large Quantity Generator Contingency Plan",
    agency: "Federal Resource Conservation & Recovery",
    type: "Hazardous Waste",
    excerpt:
      "40 CFR § 262.16(b)(2): Weekly inspections of all hazardous waste central accumulation areas (CAA) shall be conducted for leaking containers and secondary containment integrity. Inspection logs must be signed.",
    extractedTask: {
      title: "Weekly CAA Hazardous Waste Container Audit",
      citation: "40 CFR § 262.16(b)(2)",
      frequency: "Weekly",
      dueDate: "Friday, 5:00 PM",
      owner: "Facility Safety Director",
      status: "Verified",
    },
  },
];

export function LiveScannerSimulator() {
  const [selectedDoc, setSelectedDoc] = useState<SampleDoc>(SAMPLE_DOCS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(100);

  function handleSelectDoc(doc: SampleDoc) {
    if (doc.id === selectedDoc.id) return;
    setIsScanning(true);
    setProgress(0);
    setSelectedDoc(doc);

    // Simulate AI parsing progress
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 120);
  }

  return (
    <section id="simulator" className="relative border-b border-emerald-500/15 bg-background py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Interactive Experience"
          title="See how Logivra extracts obligations in real time"
          description="Click between different real-world environmental permits below to test our document parsing simulator."
        />

        {/* Document Selector Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {SAMPLE_DOCS.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => handleSelectDoc(doc)}
              className={`btn-dynamic flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                selectedDoc.id === doc.id
                  ? "border-emerald-500 bg-brand-gradient text-white shadow-md shadow-emerald-500/25"
                  : "border-border bg-surface text-foreground hover:border-emerald-500/40"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{doc.type}</span>
            </button>
          ))}
        </div>

        {/* Live Simulator Viewport */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Left: Raw Document Clause */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-emerald-500/20">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  {selectedDoc.agency}
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  {selectedDoc.name}
                </h4>
              </div>
              <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-mono text-emerald-800">
                Page 14 of 92
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-950/5 p-4 border border-emerald-500/15">
              <p className="font-mono text-xs leading-relaxed text-foreground">
                "{selectedDoc.excerpt}"
              </p>
            </div>

            {/* Scanning Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                  <ScanLine className="h-3.5 w-3.5 animate-spin" />
                  {isScanning ? "Extracting regulatory conditions..." : "Extraction Complete"}
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-500/20">
                <div
                  className="h-full bg-brand-gradient transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Extracted Structured Obligation Card */}
          <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-emerald-500/30">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Structured Compliance Obligation
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                {selectedDoc.extractedTask.status}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Obligation Title
                </span>
                <p className="text-base font-bold text-foreground">
                  {selectedDoc.extractedTask.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface p-3 border border-border">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Citation
                  </span>
                  <p className="mt-0.5 text-xs font-semibold text-foreground">
                    {selectedDoc.extractedTask.citation}
                  </p>
                </div>
                <div className="rounded-xl bg-surface p-3 border border-border">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Frequency
                  </span>
                  <p className="mt-0.5 text-xs font-semibold text-foreground">
                    {selectedDoc.extractedTask.frequency}
                  </p>
                </div>
                <div className="rounded-xl bg-surface p-3 border border-border">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Next Due Date
                  </span>
                  <p className="mt-0.5 text-xs font-semibold text-emerald-700">
                    {selectedDoc.extractedTask.dueDate}
                  </p>
                </div>
                <div className="rounded-xl bg-surface p-3 border border-border">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Assigned Owner
                  </span>
                  <p className="mt-0.5 text-xs font-semibold text-foreground">
                    {selectedDoc.extractedTask.owner}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button asChild size="sm" className="btn-dynamic bg-brand-gradient text-white text-xs">
                  <a href="#demo">Scan Your Own Permits &rarr;</a>
                </Button>
                <span className="text-[11px] text-muted-foreground">
                  Evidence auto-linked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 4: INTERACTIVE ROI & RISK CALCULATOR (DYNAMIC FEATURE)
// -------------------------------------------------------------
export function ComplianceCalculator() {
  const [facilities, setFacilities] = useState(3);
  const [permitsPerFacility, setPermitsPerFacility] = useState(8);

  // Calculations
  const totalPermits = facilities * permitsPerFacility;
  const estimatedObligations = totalPermits * 18;
  const hoursSavedPerMonth = Math.round(totalPermits * 4.2);
  const penaltyRiskAvoided = totalPermits * 12500;

  return (
    <section id="calculator" className="relative border-b border-emerald-500/15 bg-surface-gradient py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Interactive ROI Estimator"
          title="Calculate your facility's compliance savings & risk reduction"
          description="Slide to match your operational footprint and estimate the hours and penalty exposure saved."
        />

        <div className="mt-12 mx-auto max-w-4xl glass-card rounded-3xl p-6 sm:p-10 border border-emerald-500/30">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold text-foreground">
                  <span>Number of Manufacturing Facilities</span>
                  <span className="text-emerald-700 font-bold">{facilities} Sites</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={facilities}
                  onChange={(e) => setFacilities(Number(e.target.value))}
                  className="mt-3 w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>1 site</span>
                  <span>10 sites</span>
                  <span>20 sites</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-foreground">
                  <span>Active Environmental Permits per Site</span>
                  <span className="text-emerald-700 font-bold">{permitsPerFacility} Permits</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={permitsPerFacility}
                  onChange={(e) => setPermitsPerFacility(Number(e.target.value))}
                  className="mt-3 w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>2 permits</span>
                  <span>15 permits</span>
                  <span>25 permits</span>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20">
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  Based on benchmark EHS data across industrial manufacturing, each permit generates an average of 18 specific recurring obligations and takes ~4.2 hours of manual tracking per month.
                </p>
              </div>
            </div>

            {/* Calculated Output Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-white/90 dark:bg-slate-900/90">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Obligations Automated
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold font-display text-foreground">
                  {estimatedObligations.toLocaleString()}
                </p>
                <span className="text-[11px] text-emerald-700 font-medium">Never missed</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-white/90 dark:bg-slate-900/90">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Time Saved Monthly
                </span>
                <p className="mt-2 text-2xl sm:text-3xl font-extrabold font-display text-emerald-700">
                  {hoursSavedPerMonth} hrs
                </p>
                <span className="text-[11px] text-muted-foreground">Spreadsheet time eliminated</span>
              </div>

              <div className="glass-card col-span-2 rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                  Potential Violation Exposure Avoided
                </span>
                <p className="mt-1 text-3xl sm:text-4xl font-extrabold font-display">
                  ${penaltyRiskAvoided.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-emerald-100/90 leading-relaxed">
                  Average single Clean Air Act or NPDES penalty starts at $25,000+ per violation-day. Logivra removes human oversight risk completely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 5: PLATFORM FEATURES
// -------------------------------------------------------------
export function Features() {
  const features = [
    {
      icon: FileStack,
      title: "Intelligent Document Parsing",
      body: "High-accuracy extraction reads both scanned PDFs and multi-volume permit binders, tagging legal citations and exact paragraph numbers.",
    },
    {
      icon: ClipboardList,
      title: "Unified Obligation Register",
      body: "A centralized, live register with search, frequency filters, status flags, and designated plant owners across all operational units.",
    },
    {
      icon: BellRing,
      title: "Proactive Deadline Reminders",
      body: "Automated alerts via email, Slack, and dashboard widgets sent 30, 14, and 3 days before sampling, monitoring, and reporting dates.",
    },
    {
      icon: FolderCheck,
      title: "Tamper-Proof Evidence Vault",
      body: "Upload calibration certificates, laboratory chain of custodies, and inspection checklists directly linked to the specific regulatory requirement.",
    },
    {
      icon: Gauge,
      title: "Multi-Facility Governance",
      body: "Executive dashboard displaying real-time compliance health, open tasks, and audit readiness across your entire manufacturing portfolio.",
    },
    {
      icon: Share2,
      title: "1-Click Inspection Export",
      body: "Export formatted regulatory audit packages instantly for state agencies, EPA auditors, and corporate ESG sustainability reviews.",
    },
  ];

  return (
    <section id="features" className="border-b border-emerald-500/15 bg-background py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Platform Capabilities"
          title="Engineered specifically for manufacturing compliance teams"
          description="From permit renewal to audit inspection day, Logivra handles every phase of environmental governance."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card glass-card-hover group rounded-3xl p-7 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 group-hover:bg-brand-gradient group-hover:text-white transition-all shadow-xs">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-base font-bold text-foreground group-hover:text-emerald-700 transition-colors">
                {f.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 6: WHO IT'S FOR
// -------------------------------------------------------------
export function WhoItsFor() {
  const roles = [
    { icon: Users, label: "Plant EHS & Sustainability Directors" },
    { icon: Factory, label: "Industrial & Chemical Manufacturing" },
    { icon: Building2, label: "Multi-Site Operations Executives" },
    { icon: Wind, label: "Title V Air Permit Holders" },
    { icon: Droplets, label: "NPDES Industrial Wastewater Dischargers" },
    { icon: Recycle, label: "RCRA Hazardous Waste Generators" },
  ];

  return (
    <section id="who" className="border-b border-emerald-500/15 bg-surface-gradient py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 overflow-hidden rounded-3xl border border-emerald-500/20 shadow-xl lg:order-1">
            <img
              src={facility}
              alt="Modern industrial manufacturing facility with advanced environmental monitoring"
              loading="lazy"
              width={1600}
              height={1104}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              center={false}
              eyebrow="Target Operations"
              title="Tailored for facilities held accountable by regulators"
              description="Designed for 100 to 500+ employee plants managing rigorous federal, state, and local environmental permits."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {roles.map((r) => (
                <li
                  key={r.label}
                  className="glass-card flex items-center gap-3 rounded-2xl p-4 transition-all hover:border-emerald-500/40 hover:translate-x-1"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700">
                    <r.icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    {r.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 7: SECURITY & TRUST
// -------------------------------------------------------------
export function Trust() {
  const items = [
    {
      icon: Lock,
      title: "Confidentiality & Encryption",
      body: "Documents are encrypted with AES-256 at rest and TLS 1.3 in transit. Your proprietary operational data is never used to train public AI models.",
    },
    {
      icon: ServerCog,
      title: "Granular Role-Based Access",
      body: "Configurable user roles ensure plant operators, EHS engineers, and corporate leadership see only the facilities they manage.",
    },
    {
      icon: FolderCheck,
      title: "Tamper-Proof Audit Trail",
      body: "Every action, document upload, and task completion is logged with immutable timestamps for seamless third-party regulatory verification.",
    },
  ];

  return (
    <section id="trust" className="border-b border-emerald-500/15 bg-background py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Security & Governance"
          title="Enterprise-grade protection for sensitive facility permits"
          description="Compliance records are mission-critical legal assets. Logivra provides bank-grade safeguards."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.title} className="glass-card rounded-3xl p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                <i.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-base font-bold text-foreground">{i.title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {i.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 8: FAQ
// -------------------------------------------------------------
export function Faq() {
  const faqs = [
    {
      q: "What types of environmental permits can Logivra read?",
      a: "Logivra parses Title V air permits, NPDES stormwater and wastewater permits, RCRA hazardous waste plans, SPCC oil spill prevention plans, state construction permits, and consent decrees. Both native digital PDFs and scanned paper copies are supported.",
    },
    {
      q: "How does Logivra verify the accuracy of extracted obligations?",
      a: "Every extracted obligation directly links back to the exact citation, section header, and highlighted snippet of the original permit. Users can verify, edit, or customize any obligation before locking it in.",
    },
    {
      q: "How long does implementation take for a typical facility?",
      a: "Most facilities are completely live within 48 to 72 hours. Simply upload your current permit library, and Logivra's processing engine structures your registers automatically.",
    },
    {
      q: "Can Logivra replace our general EHS software?",
      a: "Logivra specializes in permit-to-task automation and regulatory obligation tracking—an area where general EHS tools fall short. It can be used standalone or alongside existing incident management software.",
    },
    {
      q: "How are notifications and alerts delivered to owners?",
      a: "Notifications are dispatched through automated email digests, in-app notification centers, and can be integrated with Microsoft Teams or Slack to alert task owners well in advance.",
    },
    {
      q: "What happens when our permit undergoes a 5-year renewal?",
      a: "When a renewed permit is issued, upload it to Logivra. The system runs an automated redline comparison highlighting newly added clauses, modified thresholds, and removed conditions.",
    },
  ];

  return (
    <section id="faq" className="border-b border-emerald-500/15 bg-surface-gradient py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know about Logivra"
          description="Have additional technical questions? Our environmental engineering team is here to assist."
        />
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f) => (
            <AccordionItem
              key={f.q}
              value={f.q}
              className="glass-card rounded-2xl px-5 border border-emerald-500/20"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-foreground hover:text-emerald-700">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground pb-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 9: FINAL CTA & DEMO BOOKING FORM
// -------------------------------------------------------------
export function FinalCta() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest('a[href="#demo"]');
      if (!link) return;
      e.preventDefault();
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#demo");
      setFlash(true);
      window.setTimeout(() => {
        (document.getElementById("work-email") as HTMLInputElement | null)?.focus({ preventScroll: true });
      }, 500);
      window.setTimeout(() => setFlash(false), 1600);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      const { error } = await supabase.from("demo_requests").insert({
        email: email.trim(),
        company: company.trim(),
        phone: phone.trim(),
        source: "landing_page",
      });
      if (error) throw error;
      setDone(true);
      setEmail("");
      setCompany("");
      setPhone("");
      toast.success("Demo request received! An environmental compliance specialist will reach out within 24 hours.");
    } catch {
      toast.error("Couldn't submit demo request. Please check connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="demo" className="relative overflow-hidden py-24 bg-gradient-to-b from-background via-emerald-950/5 to-emerald-950/15">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div
          className={`glass-card relative overflow-hidden rounded-3xl p-8 sm:p-12 border transition-all duration-700 shadow-2xl ${
            flash
              ? "border-emerald-400 ring-4 ring-emerald-500/30 scale-[1.01]"
              : "border-emerald-500/30"
          }`}
        >
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Customized Plant Evaluation
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Stop tracking compliance in fragile spreadsheets.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              See Logivra parse one of your actual facility permits during a 20-minute live demonstration.
            </p>
          </div>

          {done ? (
            <div className="mt-8 rounded-2xl bg-emerald-500/15 p-6 text-center border border-emerald-500/30">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
              <h3 className="mt-3 text-lg font-bold text-foreground">
                Thank you! Request Confirmed.
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Our environmental engineering team has received your information and will coordinate your demo session shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="btn-dynamic mt-4"
                onClick={() => setDone(false)}
              >
                Submit another request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Work Email <span className="text-emerald-600">*</span>
                </label>
                <Input
                  id="work-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ehs.manager@facility.com"
                  className="mt-1.5 h-11 border-emerald-500/25 bg-background focus-visible:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Plant / Company Name
                  </label>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Industrial Polymers"
                    className="mt-1.5 h-11 border-emerald-500/25 bg-background focus-visible:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Direct Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="mt-1.5 h-11 border-emerald-500/25 bg-background focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={busy}
                className="btn-dynamic w-full h-12 text-base font-semibold bg-brand-gradient text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35"
              >
                {busy ? "Scheduling Demo..." : "Request Platform Demo"}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                No credit card required. Enterprise privacy guaranteed.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
