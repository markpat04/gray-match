import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Home,
  LineChart,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import { caseQueue, mainCase, sections, type MockCase, type SectionId } from './data/mockCase';
import { UserApp } from './UserApp';

const assetPath = '/assets/generated-ui/';

const actionBySection: Record<SectionId, string> = {
  overview: 'Review Consent',
  consent: 'View Agent Assessment',
  agents: 'Evaluate Match',
  match: 'Send to Operator Review',
  review: 'Generate Agreement',
  agreement: 'View 14-Day Report',
  report: 'Back to Case Queue',
};

function App() {
  const [appMode, setAppMode] = useState<'user' | 'operator'>('user');
  const [selectedCase, setSelectedCase] = useState<MockCase | null>(null);
  const [section, setSection] = useState<SectionId>('overview');
  const activeIndex = sections.findIndex((item) => item.id === section);

  const openCase = (nextCase: MockCase) => {
    setSelectedCase(nextCase);
    setSection('overview');
  };

  const next = () => {
    if (section === 'report') {
      setSelectedCase(null);
      setSection('overview');
      return;
    }
    const nextSection = sections[activeIndex + 1];
    if (nextSection) {
      setSection(nextSection.id);
    }
  };

  if (appMode === 'user') {
    return <UserApp onOpenOperator={() => setAppMode('operator')} />;
  }

  return (
    <main className="min-h-screen text-slateText">
      <button
        className="fixed right-4 top-4 z-50 min-h-10 rounded-lg bg-teal px-3 text-sm font-semibold text-white shadow-card"
        onClick={() => {
          setSelectedCase(null);
          setSection('overview');
          setAppMode('user');
        }}
        type="button"
      >
        User App
      </button>
      {!selectedCase ? (
        <CaseQueue onOpenCase={openCase} />
      ) : (
        <CaseWorkspace
          activeIndex={activeIndex}
          currentSection={section}
          data={selectedCase}
          onBack={() => setSelectedCase(null)}
          onNext={next}
          onSectionChange={setSection}
        />
      )}
    </main>
  );
}

function CaseQueue({ onOpenCase }: { onOpenCase: (selectedCase: MockCase) => void }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal text-white">
              <HeartHandshake size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">GrayMate</p>
              <p className="text-sm font-medium text-slate-600">Operator Workspace</p>
            </div>
          </div>
        </div>
        <StatusBadge tone="safe" label="Post-AGI Social Wellness" />
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-white/70 bg-paper p-4 shadow-card sm:p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">Case queue</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
              Review AI-assisted matches before any pilot stay begins.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              AI agents screen, compare, and surface risk. Operators approve every high-stakes decision.
            </p>
          </div>

          <div className="grid gap-3">
            {caseQueue.map((item, index) => (
              <button
                key={item.caseId}
                className="group rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal/35 hover:shadow-card"
                onClick={() => onOpenCase(item)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-teal">{item.caseId}</p>
                      <StatusBadge label={item.status} tone={index === 0 ? 'warning' : 'neutral'} />
                    </div>
                    <h2 className="mt-2 text-lg font-semibold">
                      {item.host.name} x {item.student.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      AI Recommendation: <span className="font-semibold text-slateText">{item.recommendation}</span>
                    </p>
                  </div>
                  <span className="rounded-lg bg-mint px-3 py-2 text-sm font-semibold text-teal">
                    {item.compatibility}%
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <p className="text-sm text-slate-500">{item.safetySummary}</p>
                  <span className="text-sm font-semibold text-coral group-hover:text-teal">Open Case</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-white/70 bg-teal p-4 text-white shadow-card sm:p-6">
          <div className="flex items-center gap-2 text-mint">
            <Sparkles size={18} aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-[0.16em]">Relational wellness</p>
          </div>
          <h2 className="mt-4 text-2xl font-semibold leading-tight">
            AI agents recommend. Humans approve.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/78">
            The workspace is designed to prove the GrayMate thesis: Post-AGI wellness means orchestrating safe
            human connection, not replacing it.
          </p>
          <img
            alt="GrayMate product visual"
            className="mt-5 rounded-lg border border-white/15 bg-white/5"
            src={`${assetPath}graymate-hero-product-visual.png`}
          />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetricCard compact label="Agents" value="5" detail="specialized roles" />
            <MetricCard compact label="Decision" value="Human" detail="final approval" />
          </div>
        </aside>
      </section>
    </div>
  );
}

function CaseWorkspace({
  activeIndex,
  currentSection,
  data,
  onBack,
  onNext,
  onSectionChange,
}: {
  activeIndex: number;
  currentSection: SectionId;
  data: MockCase;
  onBack: () => void;
  onNext: () => void;
  onSectionChange: (section: SectionId) => void;
}) {
  return (
    <div className="pb-28 lg:pb-8">
      <CaseHeader data={data} onBack={onBack} />
      <ProgressStepper activeIndex={activeIndex} currentSection={currentSection} onChange={onSectionChange} />

      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentSection}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
          >
            {currentSection === 'overview' && <OverviewSection data={data} />}
            {currentSection === 'consent' && <ConsentSection data={data} />}
            {currentSection === 'agents' && <AgentAssessmentSection data={data} />}
            {currentSection === 'match' && <MatchEvaluationSection data={data} />}
            {currentSection === 'review' && <OperatorReviewSection data={data} />}
            {currentSection === 'agreement' && <AgreementSection data={data} />}
            {currentSection === 'report' && <ReportSection data={data} />}
          </motion.section>
        </AnimatePresence>

        <aside className="hidden lg:block">
          <SafetyPanel actionLabel={actionBySection[currentSection]} data={data} onAction={onNext} />
        </aside>
      </div>

      <BottomActionBar label={actionBySection[currentSection]} onClick={onNext} />
    </div>
  );
}

function CaseHeader({ data, onBack }: { data: MockCase; onBack: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-teal/10 bg-paper/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <button
          aria-label="Back to case queue"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-teal">{data.caseId}</p>
            <StatusBadge label={data.recommendation} tone="warning" />
          </div>
          <h1 className="truncate text-lg font-semibold tracking-tight">
            {data.host.name} x {data.student.name}
          </h1>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slateText">{data.compatibility}% Compatibility</p>
          <p className="text-xs text-slate-500">{data.safetySummary}</p>
        </div>
      </div>
    </header>
  );
}

function ProgressStepper({
  activeIndex,
  currentSection,
  onChange,
}: {
  activeIndex: number;
  currentSection: SectionId;
  onChange: (section: SectionId) => void;
}) {
  return (
    <nav className="sticky top-[69px] z-20 border-b border-teal/10 bg-cream/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="scrollbar-hide mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1">
        {sections.map((item, index) => {
          const isActive = item.id === currentSection;
          const isComplete = index < activeIndex;
          return (
            <button
              key={item.id}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-teal bg-teal text-white'
                  : isComplete
                    ? 'border-teal/20 bg-mint text-teal'
                    : 'border-slate-200 bg-white text-slate-600'
              }`}
              onClick={() => onChange(item.id)}
              type="button"
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${
                  isActive ? 'bg-white text-teal' : isComplete ? 'bg-teal text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isComplete ? <Check size={12} aria-hidden="true" /> : index + 1}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function OverviewSection({ data }: { data: MockCase }) {
  return (
    <div className="grid gap-4">
      <SectionTitle
        eyebrow="Case overview"
        icon={<Home size={18} />}
        title="A live case ready for operator review."
        description="This is the working surface for a partner who must decide whether the AI-assisted match is safe enough to begin a controlled pilot stay."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <PersonCard person={data.host} />
        <PersonCard person={data.student} />
      </div>

      <div className="rounded-lg border border-white/80 bg-paper p-3 shadow-card">
        <img
          alt="GrayMate product interface mockup"
          className="rounded-lg border border-slate-100"
          src={`${assetPath}graymate-hero-product-visual.png`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Compatibility" value={`${data.compatibility}%`} detail="AI-assisted recommendation" />
        <MetricCard label="Status" value="Awaiting" detail="operator review" />
        <MetricCard label="Safety" value="3" detail="conditions required" />
      </div>
    </div>
  );
}

function ConsentSection({ data }: { data: MockCase }) {
  return (
    <div className="grid gap-4">
      <SectionTitle
        eyebrow="Consent & safety"
        icon={<ShieldCheck size={18} />}
        title="The match cannot proceed without explicit boundaries."
        description="The first product moment is not matching. It is consent, role clarity, privacy, and human approval."
      />
      <div className="grid gap-3">
        <SafetyChecklist items={data.consentChecklist} />
        <div className="rounded-lg border border-coral/25 bg-coral/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-coral" size={20} aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-slateText">Students are companions, not caregivers.</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                GrayMate records this boundary before assessment, agreement generation, and operator approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentAssessmentSection({ data }: { data: MockCase }) {
  return (
    <div className="grid gap-4">
      <SectionTitle
        eyebrow="Agent assessment"
        icon={<Bot size={18} />}
        title="Two specialized agents assess each side separately."
        description="The agents produce structured summaries, then the match evaluator compares fit and risk."
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {data.agentAssessments.map((assessment, index) => (
          <AgentSummaryCard key={assessment.title} assessment={assessment} delay={index * 0.08} />
        ))}
      </div>

      <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Kizuna Profile</h3>
            <p className="text-sm text-slate-600">Relationship dimensions extracted from voice sessions.</p>
          </div>
          <StatusBadge label="Completed" tone="safe" />
        </div>
        <div className="grid gap-3">
          {data.kizunaProfile.map((dimension) => (
            <KizunaBar key={dimension.label} dimension={dimension} />
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ImageCard
          alt="GrayMate agent orchestration flow"
          image="graymate-agent-orchestration.png"
          title="Agent orchestration"
        />
        <ImageCard
          alt="GrayMate elder and student mobile previews"
          image="graymate-mobile-user-previews.png"
          title="User experience preview"
        />
      </div>
    </div>
  );
}

function MatchEvaluationSection({ data }: { data: MockCase }) {
  return (
    <div className="grid gap-4">
      <SectionTitle
        eyebrow="Match evaluation"
        icon={<HeartHandshake size={18} />}
        title="Strong match, but only with explicit conditions."
        description="The system must explain compatibility and expose risks before operator review."
      />

      <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
        <div className="grid gap-4 md:grid-cols-[180px_1fr]">
          <MatchScoreCard score={data.compatibility} verdict={data.matchEvaluation.verdict} />
          <div className="grid gap-3">
            <ListCard icon={<CheckCircle2 size={18} />} items={data.matchEvaluation.whyMatch} title="Why match" />
            <ListCard
              icon={<AlertTriangle size={18} />}
              items={data.matchEvaluation.watchOuts}
              tone="warning"
              title="Watch-outs"
            />
            <TagPanel labels={data.matchEvaluation.requiredDiscussion} title="Required discussion" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OperatorReviewSection({ data }: { data: MockCase }) {
  return (
    <div className="grid gap-4">
      <SectionTitle
        eyebrow="Operator review"
        icon={<UserCheck size={18} />}
        title="The safety gate makes the recommendation usable."
        description="AI output is not final. The operator records conditions before the agreement can be generated."
      />
      <OperatorDecisionPanel data={data} />
    </div>
  );
}

function AgreementSection({ data }: { data: MockCase }) {
  return (
    <div className="grid gap-4">
      <SectionTitle
        eyebrow="Agreement draft"
        icon={<FileText size={18} />}
        title="AI insight becomes practical boundaries."
        description="This is a co-living agreement draft, not autonomous legal advice or medical-care assignment."
      />
      <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusBadge label="AI-generated draft" tone="neutral" />
          <StatusBadge label="Human review required" tone="warning" />
        </div>
        <AgreementClauseList clauses={data.agreementClauses} />
      </div>
    </div>
  );
}

function ReportSection({ data }: { data: MockCase }) {
  return (
    <div className="grid gap-4">
      <SectionTitle
        eyebrow="14-day report"
        icon={<LineChart size={18} />}
        title="The demo closes with measurable relational wellness."
        description="Families and partners receive a consented summary, not private conversation logs."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.wellnessReport.metrics.map((metric) => (
          <MetricCard key={metric.label} detail={metric.detail} label={metric.label} value={metric.value} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Comfort trend</h3>
              <p className="text-sm text-slate-600">14-day pilot signal</p>
            </div>
            <StatusBadge label={data.wellnessReport.recommendation} tone="safe" />
          </div>
          <MiniLineChart values={data.wellnessReport.chart} />
        </div>
        <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
          <h3 className="text-lg font-semibold">Family summary</h3>
          <p className="mt-1 text-sm text-slate-600">Privacy-safe summary</p>
          <ul className="mt-4 grid gap-3">
            {data.wellnessReport.familySummary.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
                <Lock className="mt-0.5 shrink-0 text-teal" size={16} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ImageCard
        alt="GrayMate relational wellness report"
        image="graymate-relational-wellness-report.png"
        title="Report mockup"
      />
    </div>
  );
}

function SafetyPanel({
  actionLabel,
  data,
  onAction,
}: {
  actionLabel: string;
  data: MockCase;
  onAction: () => void;
}) {
  return (
    <div className="sticky top-36 grid gap-4">
      <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Safety state</p>
        <h2 className="mt-2 text-xl font-semibold">{data.recommendation}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {data.safetySummary}. Every high-stakes action stays under human approval.
        </p>
        <div className="mt-4 grid gap-2">
          {data.operatorDecision.conditions.slice(0, 3).map((condition) => (
            <div key={condition} className="flex gap-2 rounded-lg bg-mint/70 p-3 text-sm text-teal">
              <CheckCircle2 className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
              <span>{condition}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-white/80 bg-teal p-4 text-white shadow-card">
        <MessageCircle size={20} className="text-mint" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-semibold">Core message</h3>
        <p className="mt-2 text-sm leading-6 text-white/78">
          GrayMate uses AI agents not to replace human care, but to make human connection possible again.
        </p>
      </div>
      <button
        className="min-h-12 rounded-lg bg-coral px-4 py-3 text-base font-semibold text-white shadow-card"
        onClick={onAction}
        type="button"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function PersonCard({ person }: { person: MockCase['host'] }) {
  return (
    <article className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-mint text-lg font-bold text-teal">
          {person.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-teal">{person.role}</p>
          <h3 className="mt-1 text-xl font-semibold">{person.name}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {person.age} · {person.location}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{person.detail}</p>
    </article>
  );
}

function SectionTitle({
  description,
  eyebrow,
  icon,
  title,
}: {
  description: string;
  eyebrow: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card sm:p-5">
      <div className="flex items-center gap-2 text-teal">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-mint">{icon}</span>
        <p className="text-sm font-semibold uppercase tracking-[0.16em]">{eyebrow}</p>
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function SafetyChecklist({ items }: { items: string[] }) {
  return (
    <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
      <h3 className="text-lg font-semibold">Consent checklist</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint text-teal">
              <Check size={16} aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentSummaryCard({ assessment, delay }: { assessment: MockCase['agentAssessments'][number]; delay: number }) {
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-white/80 bg-paper p-4 shadow-card"
      initial={{ opacity: 0, y: 12 }}
      transition={{ delay, duration: 0.22 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-teal">
            <Bot size={18} aria-hidden="true" />
            <p className="text-sm font-semibold">{assessment.title}</p>
          </div>
          <h3 className="mt-2 text-lg font-semibold">{assessment.agentRole}</h3>
        </div>
        <StatusBadge label={assessment.status} tone="safe" />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{assessment.summary}</p>
      <ul className="mt-4 grid gap-2">
        {assessment.findings.map((finding) => (
          <li key={finding} className="flex gap-2 text-sm leading-6 text-slate-700">
            <CheckCircle2 className="mt-0.5 shrink-0 text-teal" size={16} aria-hidden="true" />
            <span>{finding}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function KizunaBar({ dimension }: { dimension: MockCase['kizunaProfile'][number] }) {
  const average = Math.round((dimension.elder + dimension.student) / 2);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold">{dimension.label}</span>
        <span className="text-slate-500">{average}% aligned</span>
      </div>
      <div className="grid gap-1.5">
        <ProgressBar label="Elder" value={dimension.elder} />
        <ProgressBar label="Student" value={dimension.student} tone="coral" />
      </div>
    </div>
  );
}

function ProgressBar({ label, tone = 'teal', value }: { label: string; tone?: 'teal' | 'coral'; value: number }) {
  return (
    <div className="grid grid-cols-[62px_1fr_38px] items-center gap-2 text-xs text-slate-500">
      <span>{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: `${value}%` }}
          className={`h-full rounded-full ${tone === 'teal' ? 'bg-teal' : 'bg-coral'}`}
          initial={{ width: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      </div>
      <span className="text-right">{value}</span>
    </div>
  );
}

function MatchScoreCard({ score, verdict }: { score: number; verdict: string }) {
  const circumference = 2 * Math.PI * 48;
  const dashOffset = circumference - (score / 100) * circumference;
  return (
    <div className="grid place-items-center rounded-lg bg-mint p-4 text-center">
      <div className="relative h-32 w-32">
        <svg aria-label={`${score}% compatibility`} className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
          <circle className="stroke-white/80" cx="60" cy="60" fill="none" r="48" strokeWidth="12" />
          <motion.circle
            animate={{ strokeDashoffset: dashOffset }}
            className="stroke-teal"
            cx="60"
            cy="60"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            r="48"
            strokeDasharray={circumference}
            strokeLinecap="round"
            strokeWidth="12"
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <p className="text-3xl font-bold text-teal">{score}%</p>
            <p className="text-xs font-semibold text-slate-500">Compatibility</p>
          </div>
        </div>
      </div>
      <h3 className="mt-3 text-lg font-semibold">{verdict}</h3>
    </div>
  );
}

function ListCard({
  icon,
  items,
  title,
  tone = 'safe',
}: {
  icon: ReactNode;
  items: string[];
  title: string;
  tone?: 'safe' | 'warning';
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4">
      <div className={`mb-3 flex items-center gap-2 ${tone === 'warning' ? 'text-coral' : 'text-teal'}`}>
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TagPanel({ labels, title }: { labels: string[]; title: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {labels.map((label) => (
          <span key={label} className="rounded-lg bg-mint px-3 py-2 text-sm font-semibold text-teal">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function OperatorDecisionPanel({ data }: { data: MockCase }) {
  return (
    <div className="rounded-lg border border-white/80 bg-paper p-4 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Decision</p>
          <h3 className="mt-2 text-2xl font-semibold">{data.operatorDecision.decision}</h3>
        </div>
        <StatusBadge label="Human approval required" tone="warning" />
      </div>
      <div className="mt-5 grid gap-3">
        {data.operatorDecision.conditions.map((condition) => (
          <div key={condition} className="flex gap-3 rounded-lg border border-slate-100 bg-white p-3">
            <ClipboardCheck className="mt-0.5 shrink-0 text-teal" size={18} aria-hidden="true" />
            <span className="text-sm leading-6 text-slate-700">{condition}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <button className="min-h-12 rounded-lg bg-teal px-4 py-3 text-sm font-semibold text-white" type="button">
          Approve Conditions
        </button>
        {data.operatorDecision.alternatives.map((alternative) => (
          <button
            key={alternative}
            className="min-h-12 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            type="button"
          >
            {alternative}
          </button>
        ))}
      </div>
    </div>
  );
}

function AgreementClauseList({ clauses }: { clauses: string[] }) {
  return (
    <ol className="grid gap-3">
      {clauses.map((clause, index) => (
        <li key={clause} className="flex gap-3 rounded-lg border border-slate-100 bg-white p-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint text-sm font-bold text-teal">
            {index + 1}
          </span>
          <span className="text-sm leading-6 text-slate-700">{clause}</span>
        </li>
      ))}
    </ol>
  );
}

function MiniLineChart({ values }: { values: number[] }) {
  const points = useMemo(() => {
    const width = 320;
    const height = 120;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * width;
        const y = height - ((value - min) / (max - min)) * (height - 18) - 9;
        return `${x},${y}`;
      })
      .join(' ');
  }, [values]);

  return (
    <svg className="h-44 w-full" role="img" viewBox="0 0 320 150">
      <title>Comfort trend increasing during the pilot</title>
      <defs>
        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#164E52" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#164E52" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((line) => (
        <line
          key={line}
          stroke="#E4E7E4"
          strokeDasharray="4 5"
          strokeWidth="1"
          x1="0"
          x2="320"
          y1={20 + line * 32}
          y2={20 + line * 32}
        />
      ))}
      <polygon fill="url(#chartFill)" points={`0,140 ${points} 320,140`} />
      <motion.polyline
        animate={{ pathLength: 1 }}
        fill="none"
        initial={{ pathLength: 0 }}
        points={points}
        stroke="#164E52"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </svg>
  );
}

function ImageCard({ alt, image, title }: { alt: string; image: string; title: string }) {
  return (
    <figure className="rounded-lg border border-white/80 bg-paper p-3 shadow-card">
      <figcaption className="mb-3 text-sm font-semibold text-teal">{title}</figcaption>
      <img alt={alt} className="rounded-lg border border-slate-100" src={`${assetPath}${image}`} />
    </figure>
  );
}

function MetricCard({
  compact = false,
  detail,
  label,
  value,
}: {
  compact?: boolean;
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-lg border border-white/75 ${
        compact ? 'bg-white/10 text-white' : 'bg-paper text-slateText shadow-card'
      } p-4`}
    >
      <p className={`text-sm font-semibold ${compact ? 'text-mint' : 'text-teal'}`}>{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      <p className={`mt-1 text-sm ${compact ? 'text-white/70' : 'text-slate-500'}`}>{detail}</p>
    </div>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: 'safe' | 'warning' | 'neutral' }) {
  const classes =
    tone === 'safe'
      ? 'bg-mint text-teal'
      : tone === 'warning'
        ? 'bg-coral/12 text-coral'
        : 'bg-slate-100 text-slate-600';
  return <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${classes}`}>{label}</span>;
}

function BottomActionBar({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-teal/10 bg-paper/95 px-4 py-3 shadow-[0_-10px_28px_rgba(22,78,82,0.12)] backdrop-blur lg:hidden">
      <button
        className="min-h-12 w-full rounded-lg bg-teal px-4 py-3 text-base font-semibold text-white"
        onClick={onClick}
        type="button"
      >
        {label}
      </button>
    </div>
  );
}

export default App;
