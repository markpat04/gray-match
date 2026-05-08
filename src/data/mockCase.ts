export type SectionId =
  | 'overview'
  | 'consent'
  | 'agents'
  | 'match'
  | 'review'
  | 'agreement'
  | 'report';

export type CaseStatus = 'Screening Complete' | 'Needs Operator Review' | 'Monitoring';

export type PersonProfile = {
  name: string;
  role: string;
  age: number;
  location: string;
  detail: string;
  initials: string;
};

export type KizunaDimension = {
  label: string;
  elder: number;
  student: number;
};

export type AgentAssessment = {
  title: string;
  agentRole: string;
  status: 'Completed' | 'Reviewing';
  summary: string;
  findings: string[];
};

export type MockCase = {
  caseId: string;
  status: CaseStatus;
  recommendation: string;
  compatibility: number;
  safetySummary: string;
  host: PersonProfile;
  student: PersonProfile;
  consentChecklist: string[];
  agentAssessments: AgentAssessment[];
  kizunaProfile: KizunaDimension[];
  matchEvaluation: {
    verdict: string;
    whyMatch: string[];
    watchOuts: string[];
    requiredDiscussion: string[];
  };
  operatorDecision: {
    decision: string;
    conditions: string[];
    alternatives: string[];
  };
  agreementClauses: string[];
  wellnessReport: {
    recommendation: string;
    metrics: Array<{
      label: string;
      value: string;
      detail: string;
    }>;
    familySummary: string[];
    chart: number[];
  };
};

export const sections: Array<{ id: SectionId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'consent', label: 'Consent' },
  { id: 'agents', label: 'Agents' },
  { id: 'match', label: 'Match' },
  { id: 'review', label: 'Review' },
  { id: 'agreement', label: 'Agreement' },
  { id: 'report', label: 'Report' },
];

export const mainCase: MockCase = {
  caseId: 'GM-1024',
  status: 'Needs Operator Review',
  recommendation: 'Approve with Conditions',
  compatibility: 91,
  safetySummary: '3 conditions required',
  host: {
    name: 'คุณยายสมศรี',
    role: 'Older adult host',
    age: 72,
    location: 'ลาดพร้าว',
    detail: 'Lives alone with one spare room',
    initials: 'สศ',
  },
  student: {
    name: 'ต้น',
    role: 'Student companion',
    age: 19,
    location: 'ม.มหิดล',
    detail: 'From ขอนแก่น, seeking a safe home in Bangkok',
    initials: 'ต',
  },
  consentChecklist: [
    'Consent completed by both sides',
    'AI agents recommend. Humans approve.',
    'Students are companions, not caregivers.',
    'Privacy-safe summary only',
    'Emergency contacts required',
    'Family approval required',
  ],
  agentAssessments: [
    {
      title: 'Elder Agent',
      agentRole: 'Social worker style assessment',
      status: 'Completed',
      summary: 'Needs evening companionship while keeping quiet mornings private.',
      findings: [
        'ต้องการเพื่อนคุยตอนเย็น',
        'ชอบบ้านเงียบ',
        'ไวต่อเสียงหลัง 21:30',
        'ต้องการให้ลูกสาวร่วมอนุมัติ',
      ],
    },
    {
      title: 'Student Agent',
      agentRole: 'Student counselor style assessment',
      status: 'Completed',
      summary: 'Reliable schedule, clear financial motivation, understands boundaries.',
      findings: [
        'กลับบ้านก่อน 20:30 ส่วนใหญ่',
        'ต้องการลดค่าหอ',
        'เข้าใจว่าไม่ใช่ caregiver',
        'ช่วงสอบต้องการพื้นที่ส่วนตัว',
      ],
    },
  ],
  kizunaProfile: [
    { label: 'Rhythm', elder: 84, student: 79 },
    { label: 'Privacy', elder: 72, student: 68 },
    { label: 'Home Vibe', elder: 81, student: 77 },
    { label: 'Meals', elder: 76, student: 70 },
    { label: 'Communication', elder: 64, student: 69 },
    { label: 'Care Boundary', elder: 88, student: 91 },
  ],
  matchEvaluation: {
    verdict: 'Strong Match with Conditions',
    whyMatch: [
      'จังหวะชีวิตใกล้กัน',
      'ทั้งคู่ชอบบ้านเงียบ',
      'ทั้งคู่ยอมรับมื้ออาหารร่วมกัน 2-3 ครั้ง/สัปดาห์',
      'นักศึกษาเข้าใจขอบเขตว่าไม่ใช่ caregiver',
    ],
    watchOuts: [
      'คุณยายไวต่อเสียงหลัง 21:30',
      'ต้นมีช่วงสอบปลายเดือน',
      'ต้องยืนยัน emergency contact',
    ],
    requiredDiscussion: [
      'quiet hours',
      'late return notice',
      'family approval',
      'medical-care boundary',
    ],
  },
  operatorDecision: {
    decision: 'Approve with Conditions',
    conditions: [
      'ลูกสาวคุณยายต้อง approve',
      'ตั้ง emergency contact 2 คน',
      'ระบุ quiet hours ใน agreement',
      'review หลัง 14 วัน',
      'ยืนยันอีกครั้งว่านักศึกษาไม่ใช่ medical caregiver',
    ],
    alternatives: ['Needs Family Meeting', 'Rematch'],
  },
  agreementClauses: [
    'ต้นจะแจ้งหากกลับหลัง 22:00',
    'Quiet hours: 21:30-07:00',
    'ทานข้าวร่วมกัน 2-3 ครั้ง/สัปดาห์เมื่อสะดวก',
    'Emergency protocol แจ้งครอบครัวและ operator',
    'นักศึกษาไม่ใช่ medical caregiver',
    'ทั้งสองฝ่ายมีสิทธิ opt-out และขอ rematch',
  ],
  wellnessReport: {
    recommendation: 'Continue Pilot',
    metrics: [
      { label: 'Check-ins', value: '13/14', detail: 'completed' },
      { label: 'Shared meals', value: '5', detail: 'in 14 days' },
      { label: 'Elder comfort', value: '3.2 → 4.4', detail: 'improved' },
      { label: 'Student comfort', value: '4.1 → 4.3', detail: 'stable' },
      { label: 'Safety incidents', value: '0', detail: 'reported' },
      { label: 'Family confidence', value: 'Improved', detail: 'privacy-safe summary' },
    ],
    familySummary: [
      'Privacy-safe summary only',
      'No raw private conversation shared',
      'Both sides report higher comfort after week two',
      'Operator recommends continuing with the same boundaries',
    ],
    chart: [32, 38, 44, 52, 60, 71, 78, 83],
  },
};

export const caseQueue = [
  mainCase,
  {
    ...mainCase,
    caseId: 'GM-1025',
    status: 'Screening Complete' as CaseStatus,
    recommendation: 'Needs Family Meeting',
    compatibility: 84,
    safetySummary: 'family consent pending',
    host: { ...mainCase.host, name: 'คุณลุงประสิทธิ์', initials: 'ป', location: 'พญาไท' },
    student: { ...mainCase.student, name: 'เมย์', initials: 'ม', location: 'จุฬาฯ' },
  },
  {
    ...mainCase,
    caseId: 'GM-1026',
    status: 'Monitoring' as CaseStatus,
    recommendation: 'Continue Pilot',
    compatibility: 88,
    safetySummary: '14-day report ready',
    host: { ...mainCase.host, name: 'คุณป้าวรรณา', initials: 'ว', location: 'บางนา' },
    student: { ...mainCase.student, name: 'นนท์', initials: 'น', location: 'เกษตรฯ' },
  },
];
