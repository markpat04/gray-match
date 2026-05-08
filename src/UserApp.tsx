import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  Heart,
  HeartHandshake,
  Home,
  LineChart,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import {
  agreementClauses,
  elderCheckInOptions,
  elderProfile,
  studentProfile,
  studentTasks as initialStudentTasks,
  wellnessReport,
  type ElderTab,
  type StudentTab,
  type UserRole,
} from './data/userMock';
import {
  onboardingByRole,
  onboardingSteps,
  roleIntros,
  type KizunaDimension,
  type MatchCandidate,
  type OnboardingStepId,
} from './data/userOnboardingMock';

type UserAppProps = {
  onOpenOperator: () => void;
};

type UserStage = 'role-select' | 'onboarding' | 'daily';

const elderTabs: Array<{ id: ElderTab; label: string; icon: LucideIcon }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'checkin', label: 'Check-in', icon: Heart },
  { id: 'agreement', label: 'Agreement', icon: FileText },
  { id: 'report', label: 'Report', icon: LineChart },
];

const studentTabs: Array<{ id: StudentTab; label: string; icon: LucideIcon }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'agreement', label: 'Agreement', icon: FileText },
  { id: 'report', label: 'Report', icon: LineChart },
];

const actionByStep: Record<OnboardingStepId, string> = {
  consent: 'ยืนยันและเริ่มโปรไฟล์',
  profile: 'เริ่ม Agent Interview',
  interview: 'Generate AI Profile',
  generated: 'ดูคู่ที่เหมาะ',
  candidates: 'ดูรายละเอียดคู่ที่ Agent เลือก',
  detail: 'Request First Meeting',
  review: 'Continue to Approved Match',
  approved: 'Open Daily App',
};

export function UserApp({ onOpenOperator }: UserAppProps) {
  const [stage, setStage] = useState<UserStage>('role-select');
  const [role, setRole] = useState<UserRole>('elder');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedCandidateId, setSelectedCandidateId] = useState(onboardingByRole.elder.candidates[0].id);
  const [elderTab, setElderTab] = useState<ElderTab>('home');
  const [studentTab, setStudentTab] = useState<StudentTab>('home');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);
  const [tasks, setTasks] = useState(initialStudentTasks);

  const activeTabs = role === 'elder' ? elderTabs : studentTabs;
  const activeTab = role === 'elder' ? elderTab : studentTab;
  const onboardingData = onboardingByRole[role];
  const selectedCandidate =
    onboardingData.candidates.find((candidate) => candidate.id === selectedCandidateId) ?? onboardingData.candidates[0];

  const setActiveTab = (tab: ElderTab | StudentTab) => {
    if (role === 'elder') {
      setElderTab(tab as ElderTab);
    } else {
      setStudentTab(tab as StudentTab);
    }
  };

  const switchRole = (nextRole: UserRole) => {
    setRole(nextRole);
    setSelectedCandidateId(onboardingByRole[nextRole].candidates[0].id);
  };

  const startOnboarding = (nextRole: UserRole) => {
    switchRole(nextRole);
    setOnboardingStep(0);
    setStage('onboarding');
  };

  const goBackOnboarding = () => {
    if (onboardingStep === 0) {
      setStage('role-select');
      return;
    }
    setOnboardingStep((current) => current - 1);
  };

  const goNextOnboarding = () => {
    setOnboardingStep((current) => Math.min(current + 1, onboardingSteps.length - 1));
  };

  const openDailyApp = () => {
    setStage('daily');
    if (role === 'elder') {
      setElderTab('home');
    } else {
      setStudentTab('home');
    }
  };

  const restartFirstUse = () => {
    setStage('role-select');
    setOnboardingStep(0);
  };

  return (
    <main className="min-h-screen bg-cream px-0 py-0 text-slateText sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] items-start justify-center">
        {stage === 'role-select' && <RoleSelectScreen onOpenOperator={onOpenOperator} onSelectRole={startOnboarding} />}

        {stage === 'onboarding' && (
          <FirstUseFlow
            onBack={goBackOnboarding}
            onNext={goNextOnboarding}
            onOpenDaily={openDailyApp}
            onOpenOperator={onOpenOperator}
            onRestart={restartFirstUse}
            role={role}
            selectedCandidate={selectedCandidate}
            stepIndex={onboardingStep}
          />
        )}

        {stage === 'daily' && (
          <UserPhoneShell
            activeTab={activeTab}
            activeTabs={activeTabs}
            onOpenOperator={onOpenOperator}
            onRoleChange={switchRole}
            onTabChange={setActiveTab}
            role={role}
          >
            {role === 'elder' && elderTab === 'home' && <ElderHome />}
            {role === 'elder' && elderTab === 'checkin' && (
              <ElderCheckIn
                onMoodSelect={(mood) => {
                  setSelectedMood(mood);
                  setCheckInSubmitted(false);
                }}
                onSubmit={() => setCheckInSubmitted(true)}
                selectedMood={selectedMood}
                submitted={checkInSubmitted}
              />
            )}
            {role === 'elder' && elderTab === 'agreement' && <UserAgreement role="elder" />}
            {role === 'elder' && elderTab === 'report' && <UserReport role="elder" />}

            {role === 'student' && studentTab === 'home' && <StudentHome />}
            {role === 'student' && studentTab === 'tasks' && (
              <StudentTasks
                tasks={tasks}
                onToggle={(taskId) =>
                  setTasks((current) =>
                    current.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
                  )
                }
              />
            )}
            {role === 'student' && studentTab === 'agreement' && <UserAgreement role="student" />}
            {role === 'student' && studentTab === 'report' && <UserReport role="student" />}
          </UserPhoneShell>
        )}
      </div>
    </main>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-cream sm:min-h-[860px] sm:overflow-hidden sm:rounded-[28px] sm:border sm:border-white sm:shadow-card">
      {children}
    </section>
  );
}

function RoleSelectScreen({
  onOpenOperator,
  onSelectRole,
}: {
  onOpenOperator: () => void;
  onSelectRole: (role: UserRole) => void;
}) {
  return (
    <PhoneFrame>
      <header className="sticky top-0 z-20 border-b border-teal/10 bg-paper/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold tracking-tight">GrayMate</p>
            <p className="text-sm font-medium text-slate-600">First-use matching</p>
          </div>
          <button
            className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-teal"
            onClick={onOpenOperator}
            type="button"
          >
            Operator
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
        <section className="rounded-lg bg-teal p-5 text-white shadow-card">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/15 text-mint">
            <HeartHandshake size={26} />
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-mint">Post-AGI Social Wellness</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Choose Your Role</h1>
          <p className="mt-3 text-base leading-7 text-white/80">
            เริ่มจากการคัดกรองด้วย AI agents แล้วให้มนุษย์อนุมัติก่อนทดลองอยู่ร่วมกันจริง
          </p>
        </section>

        <div className="mt-4 grid gap-3">
          {(['elder', 'student'] as const).map((option) => {
            const intro = roleIntros[option];
            const Icon = option === 'elder' ? UserRound : ClipboardList;
            return (
              <button
                key={option}
                className="rounded-lg border border-white bg-paper p-4 text-left shadow-card transition active:scale-[0.99]"
                onClick={() => onSelectRole(option)}
                type="button"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-mint text-teal">
                    <Icon size={24} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-lg font-semibold">{intro.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">{intro.title}</span>
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {intro.bullets.map((bullet) => (
                    <span key={bullet} className="rounded-lg bg-mint px-3 py-2 text-xs font-semibold text-teal">
                      {bullet}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </PhoneFrame>
  );
}

function FirstUseFlow({
  onBack,
  onNext,
  onOpenDaily,
  onOpenOperator,
  onRestart,
  role,
  selectedCandidate,
  stepIndex,
}: {
  onBack: () => void;
  onNext: () => void;
  onOpenDaily: () => void;
  onOpenOperator: () => void;
  onRestart: () => void;
  role: UserRole;
  selectedCandidate: MatchCandidate;
  stepIndex: number;
}) {
  const step = onboardingSteps[stepIndex];
  const data = onboardingByRole[role];
  const intro = roleIntros[role];
  const isApproved = step.id === 'approved';

  return (
    <PhoneFrame>
      <header className="sticky top-0 z-20 border-b border-teal/10 bg-paper/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft size={19} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-semibold tracking-tight">GrayMate</p>
            <p className="truncate text-sm font-medium text-slate-600">{intro.label} onboarding</p>
          </div>
          <button
            className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-teal"
            onClick={onOpenOperator}
            type="button"
          >
            Operator
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <OnboardingProgress stepIndex={stepIndex} />
        <motion.div
          key={`${role}-${step.id}-${selectedCandidate.id}`}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
        >
          <OnboardingStepContent
            onRestart={onRestart}
            role={role}
            selectedCandidate={selectedCandidate}
            stepId={step.id}
          />
        </motion.div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-teal/10 bg-paper/95 px-4 py-3 shadow-[0_-10px_28px_rgba(22,78,82,0.12)] backdrop-blur sm:absolute">
        <div className="mx-auto max-w-[430px]">
          <button
            className="min-h-14 w-full rounded-lg bg-teal px-4 py-3 text-base font-semibold text-white shadow-card"
            onClick={isApproved ? onOpenDaily : onNext}
            type="button"
          >
            {actionByStep[step.id]}
          </button>
          {!isApproved && (
            <p className="mt-2 text-center text-xs font-medium text-slate-500">
              Step {stepIndex + 1}/{onboardingSteps.length}: {step.label}
            </p>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

function OnboardingProgress({ stepIndex }: { stepIndex: number }) {
  const current = onboardingSteps[stepIndex];
  return (
    <section className="mb-4 rounded-lg bg-paper p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">First-use flow</p>
          <h2 className="mt-1 text-xl font-semibold">{current.label}</h2>
        </div>
        <span className="rounded-lg bg-mint px-3 py-2 text-sm font-bold text-teal">
          {stepIndex + 1}/{onboardingSteps.length}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-8 gap-1">
        {onboardingSteps.map((step, index) => (
          <div
            key={step.id}
            className={`h-2 rounded-full ${index <= stepIndex ? 'bg-teal' : 'bg-slate-200'}`}
            title={step.label}
          />
        ))}
      </div>
    </section>
  );
}

function OnboardingStepContent({
  onRestart,
  role,
  selectedCandidate,
  stepId,
}: {
  onRestart: () => void;
  role: UserRole;
  selectedCandidate: MatchCandidate;
  stepId: OnboardingStepId;
}) {
  if (stepId === 'consent') {
    return <ConsentBoundaryStep role={role} />;
  }
  if (stepId === 'profile') {
    return <ProfileSetupStep role={role} />;
  }
  if (stepId === 'interview') {
    return <AgentInterviewStep role={role} />;
  }
  if (stepId === 'generated') {
    return <GeneratedProfileStep role={role} />;
  }
  if (stepId === 'candidates') {
    return <MatchCandidatesStep role={role} />;
  }
  if (stepId === 'detail') {
    return <MatchDetailStep role={role} selectedCandidate={selectedCandidate} />;
  }
  if (stepId === 'review') {
    return <HumanReviewStep role={role} selectedCandidate={selectedCandidate} />;
  }
  return <ApprovedMatchStep onRestart={onRestart} role={role} selectedCandidate={selectedCandidate} />;
}

function StepHeader({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg bg-paper p-5 shadow-card">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint text-teal">{icon}</div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-base leading-7 text-slate-600">{description}</p>
    </section>
  );
}

function ConsentBoundaryStep({ role }: { role: UserRole }) {
  const data = onboardingByRole[role];
  const elder = role === 'elder';
  return (
    <div className="grid gap-4">
      <StepHeader
        description={
          elder
            ? 'ก่อนจับคู่ ระบบต้องยืนยันความยินยอม ครอบครัวที่ติดต่อได้ และขอบเขตที่ไม่ใช่การดูแลทางการแพทย์'
            : 'ก่อนจับคู่ ระบบต้องยืนยันว่าคุณเข้าใจบทบาท companion และการแจ้งเตือนตามข้อตกลง'
        }
        icon={<ShieldCheck size={22} />}
        title="Consent & Boundary"
      />

      <div className="grid gap-3">
        {data.consentChecklist.map((item) => (
          <div key={item} className="flex gap-3 rounded-lg bg-paper p-4 shadow-card">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint text-teal">
              <Check size={17} />
            </span>
            <span className={`${elder ? 'text-lg leading-8' : 'text-sm leading-6'} text-slate-700`}>{item}</span>
          </div>
        ))}
      </div>

      <BoundaryNotice large={elder} />
    </div>
  );
}

function ProfileSetupStep({ role }: { role: UserRole }) {
  const data = onboardingByRole[role];
  const elder = role === 'elder';
  return (
    <div className="grid gap-4">
      <StepHeader
        description={
          elder
            ? 'ระบบเก็บข้อมูลสำคัญเท่าที่จำเป็นเพื่อหาคนที่เข้ากับบ้าน จังหวะชีวิต และครอบครัว'
            : 'ระบบเก็บข้อมูลเรื่องตารางเรียน งบประมาณ และการเดินทาง เพื่อหาบ้านที่อยู่ได้จริง'
        }
        icon={<UserRound size={22} />}
        title="Basic Profile"
      />

      <div className="grid gap-3">
        {data.profileItems.map((item) => (
          <div key={item.label} className="rounded-lg bg-paper p-4 shadow-card">
            <p className="text-sm font-semibold text-teal">{item.label}</p>
            <p className={`${elder ? 'text-xl' : 'text-lg'} mt-1 font-semibold`}>{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-teal/15 bg-mint p-4">
        <p className="font-semibold text-teal">Mock answers saved</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          ใน demo นี้คำตอบถูกเตรียมไว้แล้ว เพื่อให้กรรมการเห็น flow จนถึง match ได้ภายในไม่กี่นาที
        </p>
      </section>
    </div>
  );
}

function AgentInterviewStep({ role }: { role: UserRole }) {
  const data = onboardingByRole[role];
  const elder = role === 'elder';
  return (
    <div className="grid gap-4">
      <StepHeader
        description="จำลอง agent interview แบบเสียง โดยให้ AI ถามเหมือนคนสัมภาษณ์และสรุปเป็นข้อมูลที่ใช้จับคู่ได้"
        icon={<Bot size={22} />}
        title="Lifestyle Interview"
      />

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal">{data.agentName}</p>
            <h2 className="mt-1 text-lg font-semibold">Analyzing human rhythm</h2>
          </div>
          <span className="rounded-lg bg-mint px-3 py-2 text-xs font-bold text-teal">Completed</span>
        </div>
      </section>

      <div className="grid gap-3">
        {data.interviewTurns.map((turn, index) => {
          const agent = turn.speaker === 'agent';
          return (
            <motion.article
              key={`${turn.title}-${index}`}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg p-4 shadow-card ${
                agent ? 'mr-8 bg-paper' : 'ml-8 bg-teal text-white'
              }`}
              initial={{ opacity: 0, y: 10 }}
              transition={{ delay: index * 0.06, duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                {agent ? <MessageCircle size={18} /> : <UserRound size={18} />}
                <p className={`text-sm font-semibold ${agent ? 'text-teal' : 'text-mint'}`}>{turn.title}</p>
              </div>
              <p className={`${elder ? 'text-lg leading-8' : 'text-sm leading-6'} mt-2`}>{turn.text}</p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function GeneratedProfileStep({ role }: { role: UserRole }) {
  const data = onboardingByRole[role];
  return (
    <div className="grid gap-4">
      <StepHeader
        description="AI agent เปลี่ยนบทสนทนาเป็น Kizuna Profile เพื่อให้ match มีเหตุผล อธิบายได้ และตรวจสอบได้"
        icon={<Sparkles size={22} />}
        title="AI Profile Generated"
      />

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal">Kizuna Profile</p>
            <h2 className="mt-1 text-xl font-semibold">{data.agentName} Completed</h2>
          </div>
          <CheckCircle2 className="shrink-0 text-teal" size={24} />
        </div>
        <div className="mt-5 grid gap-4">
          {data.kizunaProfile.map((dimension) => (
            <GeneratedKizunaBar key={dimension.label} dimension={dimension} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-coral/20 bg-coral/10 p-4">
        <p className="font-semibold text-coral">AI profile is not a final decision.</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          ระบบใช้ profile นี้เพื่อแนะนำคู่ แต่ยังต้องผ่าน operator และครอบครัวก่อนทดลองอยู่จริง
        </p>
      </section>
    </div>
  );
}

function MatchCandidatesStep({ role }: { role: UserRole }) {
  const data = onboardingByRole[role];
  const agentSelectedCandidate = data.candidates[0];
  return (
    <div className="grid gap-4">
      <StepHeader
        description="Match Evaluator Agent คัดเลือกคู่ที่เหมาะที่สุดให้แล้ว ผู้ใช้เห็นผลลัพธ์เดียวที่ระบบแนะนำ ไม่ต้องเลือกเอง"
        icon={<Users size={22} />}
        title="Match Candidates"
      />

      <section className="rounded-lg border border-teal/15 bg-mint p-4">
        <div className="flex gap-3">
          <Bot className="mt-0.5 shrink-0 text-teal" size={22} />
          <div>
            <p className="font-semibold text-teal">Sub-agent decision completed</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              ระบบเลือกคู่หลักจาก compatibility, safety boundary, lifestyle rhythm และเงื่อนไขที่ต้องคุยก่อนนัดจริง
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        <CandidateRecommendationCard candidate={agentSelectedCandidate} />
      </div>
    </div>
  );
}

function CandidateRecommendationCard({ candidate }: { candidate: MatchCandidate }) {
  return (
    <article className="rounded-lg border border-teal bg-mint p-4 shadow-card">
      <div className="flex items-start gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-teal text-lg font-bold text-white">
          {candidate.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold">{candidate.name}</span>
            <span className="rounded-lg bg-white/80 px-2 py-1 text-xs font-bold text-teal">
              Agent selected
            </span>
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">{candidate.headline}</span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">{candidate.location}</span>
        </span>
        <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-teal">{candidate.compatibility}%</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{candidate.summary}</p>
    </article>
  );
}

function MatchDetailStep({ role, selectedCandidate }: { role: UserRole; selectedCandidate: MatchCandidate }) {
  return (
    <div className="grid gap-4">
      <StepHeader
        description="ก่อนกดนัดคุย ระบบต้องโชว์ว่าเหมาะกันเพราะอะไร และมีเงื่อนไขอะไรที่ต้องคุยให้ชัด"
        icon={<HeartHandshake size={22} />}
        title="Match Detail"
      />

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <div className="flex items-start gap-3">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-teal text-xl font-bold text-white">
            {selectedCandidate.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-semibold">{selectedCandidate.name}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{selectedCandidate.headline}</p>
          </div>
          <div className="rounded-lg bg-mint px-3 py-2 text-center text-teal">
            <p className="text-xl font-bold">{selectedCandidate.compatibility}%</p>
            <p className="text-[11px] font-semibold">match</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">{selectedCandidate.summary}</p>
      </section>

      <OnboardingListCard icon={<CheckCircle2 size={18} />} items={selectedCandidate.why} title="Why this match" />
      <OnboardingListCard
        icon={<AlertTriangle size={18} />}
        items={selectedCandidate.watchOuts}
        tone="warning"
        title="Watch-outs"
      />
      <TagPanel labels={selectedCandidate.conditions} title={role === 'elder' ? 'ต้องคุยให้ชัดก่อนนัด' : 'Required conditions'} />
    </div>
  );
}

function HumanReviewStep({ role, selectedCandidate }: { role: UserRole; selectedCandidate: MatchCandidate }) {
  const data = onboardingByRole[role];
  return (
    <div className="grid gap-4">
      <StepHeader
        description="จุดนี้คือ safety gate สำคัญ: AI แนะนำได้ แต่ match ยังไม่ถือว่าสำเร็จจนกว่ามนุษย์จะอนุมัติ"
        icon={<ShieldCheck size={22} />}
        title="Human Review"
      />

      <section className="rounded-lg bg-teal p-5 text-white shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint">Recommended match</p>
        <h2 className="mt-2 text-2xl font-semibold">{selectedCandidate.name}</h2>
        <p className="mt-2 text-sm leading-6 text-white/80">
          AI recommends. Humans approve. Operator และครอบครัวต้องเห็นเงื่อนไขก่อนเริ่มทดลองอยู่ร่วมกัน
        </p>
      </section>

      <div className="grid gap-3">
        {data.approvalChecks.map((check) => (
          <div key={check} className="flex items-center gap-3 rounded-lg bg-paper p-4 shadow-card">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint text-teal">
              <Check size={17} />
            </span>
            <span className="text-sm font-semibold text-slate-700">{check}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApprovedMatchStep({
  onRestart,
  role,
  selectedCandidate,
}: {
  onRestart: () => void;
  role: UserRole;
  selectedCandidate: MatchCandidate;
}) {
  const data = onboardingByRole[role];
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-teal p-5 text-white shadow-card">
        <CheckCircle2 className="text-mint" size={34} />
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-mint">Approved Match</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.successTitle}</h1>
        <p className="mt-3 text-base leading-7 text-white/80">{data.successCopy}</p>
      </section>

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <div className="flex items-start gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-mint text-lg font-bold text-teal">
            {selectedCandidate.initials}
          </span>
          <div>
            <p className="text-xl font-semibold">{selectedCandidate.name}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{selectedCandidate.headline}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <div className="flex gap-3">
          <CalendarDays className="mt-0.5 shrink-0 text-teal" size={22} />
          <div>
            <p className="font-semibold">First meeting</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{selectedCandidate.firstMeeting}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <p className="font-semibold">Agreement summary</p>
        <ul className="mt-3 grid gap-2">
          {selectedCandidate.agreementSummary.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
              <ShieldCheck className="mt-0.5 shrink-0 text-teal" size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <button
        className="min-h-12 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-teal"
        onClick={onRestart}
        type="button"
      >
        เลือก role ใหม่
      </button>
    </div>
  );
}

function GeneratedKizunaBar({ dimension }: { dimension: KizunaDimension }) {
  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{dimension.label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{dimension.detail}</p>
        </div>
        <span className="text-sm font-bold text-teal">{dimension.value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: `${dimension.value}%` }}
          className="h-full rounded-full bg-teal"
          initial={{ width: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function OnboardingListCard({
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
    <section className="rounded-lg bg-paper p-4 shadow-card">
      <div className={`mb-3 flex items-center gap-2 ${tone === 'warning' ? 'text-coral' : 'text-teal'}`}>
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TagPanel({ labels, title }: { labels: string[]; title: string }) {
  return (
    <section className="rounded-lg bg-paper p-4 shadow-card">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {labels.map((label) => (
          <span key={label} className="rounded-lg bg-mint px-3 py-2 text-sm font-semibold text-teal">
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

function UserPhoneShell({
  activeTab,
  activeTabs,
  children,
  onOpenOperator,
  onRoleChange,
  onTabChange,
  role,
}: {
  activeTab: ElderTab | StudentTab;
  activeTabs: Array<{ id: ElderTab | StudentTab; label: string; icon: LucideIcon }>;
  children: ReactNode;
  onOpenOperator: () => void;
  onRoleChange: (role: UserRole) => void;
  onTabChange: (tab: ElderTab | StudentTab) => void;
  role: UserRole;
}) {
  return (
    <PhoneFrame>
      <header className="sticky top-0 z-20 border-b border-teal/10 bg-paper/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold tracking-tight">GrayMate</p>
            <p className="text-sm font-medium text-slate-600">Daily wellness</p>
          </div>
          <button
            className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-teal"
            onClick={onOpenOperator}
            type="button"
          >
            Operator
          </button>
        </div>
        <RoleSwitcher onChange={onRoleChange} role={role} />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        <motion.div
          key={`${role}-${activeTab}`}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18 }}
        >
          {children}
        </motion.div>
      </div>

      <UserBottomNav activeTab={activeTab} tabs={activeTabs} onTabChange={onTabChange} />
    </PhoneFrame>
  );
}

function RoleSwitcher({ onChange, role }: { onChange: (role: UserRole) => void; role: UserRole }) {
  return (
    <div className="mt-4 grid grid-cols-2 rounded-lg bg-mint p-1">
      {[
        { id: 'elder' as const, label: 'ผู้สูงวัย' },
        { id: 'student' as const, label: 'นักศึกษา' },
      ].map((option) => (
        <button
          key={option.id}
          className={`min-h-11 rounded-lg text-sm font-semibold transition ${
            role === option.id ? 'bg-teal text-white shadow-sm' : 'text-teal'
          }`}
          onClick={() => onChange(option.id)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ElderHome() {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-paper p-5 shadow-card">
        <p className="text-lg font-semibold text-teal">สวัสดีค่ะ</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{elderProfile.name}</h1>
        <p className="mt-3 text-lg leading-8 text-slate-700">{elderProfile.aiNote}</p>
      </section>

      <section className="rounded-lg border border-white/80 bg-paper p-5 shadow-card">
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-mint text-xl font-bold text-teal">
            ต
          </div>
          <div>
            <p className="text-lg font-semibold">ต้น</p>
            <p className="mt-1 text-lg leading-7 text-slate-700">จะกลับบ้านประมาณ {elderProfile.returnTime}</p>
            <span className="mt-3 inline-flex rounded-lg bg-mint px-3 py-2 text-base font-semibold text-teal">
              สถานะปลอดภัย
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        <LargeAction icon={<Phone size={24} />} label="โทรหาต้น" />
        <LargeAction icon={<Utensils size={24} />} label="นัดทานข้าวด้วยกัน" />
        <EmergencyButton />
      </div>

      <BoundaryNotice large />
    </div>
  );
}

function ElderCheckIn({
  onMoodSelect,
  onSubmit,
  selectedMood,
  submitted,
}: {
  onMoodSelect: (mood: string) => void;
  onSubmit: () => void;
  selectedMood: string | null;
  submitted: boolean;
}) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-paper p-5 shadow-card">
        <h1 className="text-2xl font-semibold">วันนี้รู้สึกอย่างไรบ้างคะ</h1>
        <p className="mt-2 text-lg leading-8 text-slate-600">
          เลือกคำตอบที่ใกล้เคียงที่สุด ระบบจะสรุปให้ครอบครัวแบบปลอดภัย
        </p>
      </section>

      <div className="grid gap-3">
        {elderCheckInOptions.map((option) => (
          <button
            key={option.id}
            className={`min-h-20 rounded-lg border p-4 text-left transition ${
              selectedMood === option.id ? 'border-teal bg-mint' : 'border-white bg-paper shadow-card'
            }`}
            onClick={() => onMoodSelect(option.id)}
            type="button"
          >
            <p className="text-2xl font-semibold">{option.label}</p>
            <p className="mt-1 text-lg text-slate-600">{option.detail}</p>
          </button>
        ))}
      </div>

      <section className="rounded-lg bg-paper p-5 shadow-card">
        <p className="text-lg font-semibold">วันนี้อยากให้ระบบช่วยอะไรไหม</p>
        <div className="mt-3 min-h-24 rounded-lg border border-slate-200 bg-white p-4 text-lg text-slate-500">
          พิมพ์หรือบอกสิ่งที่อยากให้ช่วย...
        </div>
      </section>

      <button
        className="min-h-16 rounded-lg bg-teal px-5 text-xl font-semibold text-white disabled:opacity-45"
        disabled={!selectedMood}
        onClick={onSubmit}
        type="button"
      >
        ส่ง Check-in
      </button>

      {submitted && (
        <div className="rounded-lg bg-mint p-4 text-lg font-semibold text-teal">ส่งข้อมูลให้ระบบแล้ว</div>
      )}
    </div>
  );
}

function StudentHome() {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-teal p-5 text-white shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint">บ้านของคุณ</p>
        <h1 className="mt-2 text-3xl font-semibold">{studentProfile.home}</h1>
        <div className="mt-4 inline-flex rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold">
          ประหยัดได้ {studentProfile.rentSaved}
        </div>
      </section>

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-mint text-lg font-bold text-teal">
            สศ
          </div>
          <div>
            <p className="font-semibold">{studentProfile.elderName}วันนี้{studentProfile.elderMood}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Check-in ล่าสุดเมื่อเช้านี้ ไม่มีเหตุฉุกเฉิน</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gold/25 bg-[#FFF6DF] p-4">
        <div className="flex gap-3">
          <Bell className="mt-0.5 shrink-0 text-gold" size={20} />
          <div>
            <p className="font-semibold">AI Nudge</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{studentProfile.aiNudge}</p>
          </div>
        </div>
      </section>

      <BoundaryNotice />
    </div>
  );
}

function StudentTasks({
  onToggle,
  tasks,
}: {
  onToggle: (taskId: string) => void;
  tasks: typeof initialStudentTasks;
}) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-paper p-5 shadow-card">
        <h1 className="text-2xl font-semibold">วันนี้ต้องทำอะไรบ้าง</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Checklist นี้เป็นข้อตกลงร่วม ไม่ใช่งานดูแลทางการแพทย์
        </p>
      </section>

      <div className="grid gap-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            className="flex min-h-16 items-center gap-3 rounded-lg border border-white bg-paper p-4 text-left shadow-card"
            onClick={() => onToggle(task.id)}
            type="button"
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${
                task.done ? 'border-teal bg-teal text-white' : 'border-slate-300 bg-white text-transparent'
              }`}
            >
              <Check size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{task.label}</span>
              <span className="mt-1 block text-sm text-slate-600">{task.detail}</span>
            </span>
          </button>
        ))}
      </div>

      <section className="rounded-lg border border-coral/20 bg-coral/10 p-4">
        <p className="font-semibold text-coral">แจ้งถ้ากลับหลัง 22:00</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          กดส่งข้อความล่วงหน้า เพื่อให้คุณยายและครอบครัวสบายใจ
        </p>
      </section>
    </div>
  );
}

function UserAgreement({ role }: { role: UserRole }) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-paper p-5 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Co-living agreement</p>
        <h1 className={`${role === 'elder' ? 'text-3xl' : 'text-2xl'} mt-2 font-semibold`}>ข้อตกลงสำคัญ</h1>
        <p className={`${role === 'elder' ? 'text-lg leading-8' : 'text-sm leading-6'} mt-2 text-slate-600`}>
          ข้อตกลงนี้ช่วยให้ทั้งสองฝ่ายอยู่ร่วมกันอย่างสบายใจและปลอดภัย
        </p>
      </section>

      <ol className="grid gap-3">
        {agreementClauses.map((clause, index) => (
          <li key={clause} className="flex gap-3 rounded-lg bg-paper p-4 shadow-card">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mint font-bold text-teal">
              {index + 1}
            </span>
            <span className={`${role === 'elder' ? 'text-lg leading-8' : 'text-sm leading-6'} text-slate-700`}>
              {clause}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function UserReport({ role }: { role: UserRole }) {
  const summary = role === 'elder' ? wellnessReport.elderSummary : wellnessReport.studentSummary;
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-paper p-5 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">14-day report</p>
        <h1 className={`${role === 'elder' ? 'text-3xl' : 'text-2xl'} mt-2 font-semibold`}>
          {wellnessReport.recommendation}
        </h1>
        <p className={`${role === 'elder' ? 'text-lg leading-8' : 'text-sm leading-6'} mt-2 text-slate-600`}>
          Privacy-safe summary ไม่ส่งบทสนทนาดิบให้ใคร
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        {wellnessReport.metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg bg-paper p-4 shadow-card">
            <p className="text-sm font-semibold text-teal">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <h2 className="font-semibold">Comfort trend</h2>
        <MiniUserChart values={wellnessReport.chart} />
      </section>

      <section className="rounded-lg bg-paper p-4 shadow-card">
        <h2 className="font-semibold">สรุปสำหรับคุณ</h2>
        <ul className="mt-3 grid gap-2">
          {summary.map((item) => (
            <li key={item} className={`${role === 'elder' ? 'text-lg leading-8' : 'text-sm leading-6'} flex gap-2`}>
              <ShieldCheck className="mt-1 shrink-0 text-teal" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function UserBottomNav({
  activeTab,
  onTabChange,
  tabs,
}: {
  activeTab: ElderTab | StudentTab;
  onTabChange: (tab: ElderTab | StudentTab) => void;
  tabs: Array<{ id: ElderTab | StudentTab; label: string; icon: LucideIcon }>;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-teal/10 bg-paper/95 px-3 py-2 shadow-[0_-10px_28px_rgba(22,78,82,0.12)] backdrop-blur sm:absolute">
      <div className="mx-auto grid max-w-[430px] grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`min-h-14 rounded-lg px-2 py-2 text-xs font-semibold transition ${
                active ? 'bg-teal text-white' : 'text-slate-600'
              }`}
              onClick={() => onTabChange(tab.id)}
              type="button"
            >
              <Icon className="mx-auto mb-1" size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function LargeAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      className="flex min-h-16 items-center gap-4 rounded-lg bg-teal px-5 text-xl font-semibold text-white shadow-card"
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function EmergencyButton() {
  return (
    <button
      className="flex min-h-20 items-center justify-center gap-4 rounded-lg bg-coral px-5 text-2xl font-bold text-white shadow-card"
      type="button"
    >
      <AlertTriangle size={28} />
      <span>แจ้งเหตุฉุกเฉิน SOS</span>
    </button>
  );
}

function BoundaryNotice({ large = false }: { large?: boolean }) {
  return (
    <section className="rounded-lg border border-coral/20 bg-coral/10 p-4">
      <div className="flex gap-3">
        <ShieldCheck className="mt-1 shrink-0 text-coral" size={large ? 24 : 20} />
        <div>
          <p className={`${large ? 'text-xl' : 'text-base'} font-semibold text-coral`}>
            นักศึกษาไม่ใช่ผู้ดูแลทางการแพทย์
          </p>
          <p className={`${large ? 'text-lg leading-8' : 'text-sm leading-6'} mt-1 text-slate-700`}>
            บทบาทคือ companion และเพื่อนบ้านที่ดี หากฉุกเฉินระบบจะแจ้งครอบครัวและ operator
          </p>
        </div>
      </div>
    </section>
  );
}

function MiniUserChart({ values }: { values: number[] }) {
  const points = useMemo(() => {
    const width = 300;
    const height = 100;
    const max = Math.max(...values);
    const min = Math.min(...values);
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * width;
        const y = height - ((value - min) / (max - min)) * (height - 16) - 8;
        return `${x},${y}`;
      })
      .join(' ');
  }, [values]);

  return (
    <svg className="mt-3 h-32 w-full" viewBox="0 0 300 120" role="img">
      <title>Comfort trend</title>
      <polyline
        fill="none"
        points={points}
        stroke="#164E52"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  );
}
