import type { UserRole } from './userMock';

export type OnboardingStepId =
  | 'consent'
  | 'profile'
  | 'interview'
  | 'generated'
  | 'candidates'
  | 'detail'
  | 'review'
  | 'approved';

export type MatchCandidate = {
  id: string;
  name: string;
  initials: string;
  headline: string;
  location: string;
  compatibility: number;
  status: string;
  summary: string;
  why: string[];
  watchOuts: string[];
  conditions: string[];
  agreementSummary: string[];
  firstMeeting: string;
};

export type KizunaDimension = {
  label: string;
  value: number;
  detail: string;
};

export const onboardingSteps: Array<{ id: OnboardingStepId; label: string }> = [
  { id: 'consent', label: 'Consent' },
  { id: 'profile', label: 'Profile' },
  { id: 'interview', label: 'Interview' },
  { id: 'generated', label: 'AI Profile' },
  { id: 'candidates', label: 'Matches' },
  { id: 'detail', label: 'Detail' },
  { id: 'review', label: 'Review' },
  { id: 'approved', label: 'Approved' },
];

export const roleIntros: Record<
  UserRole,
  {
    label: string;
    title: string;
    description: string;
    bullets: string[];
  }
> = {
  elder: {
    label: 'ผู้สูงวัย',
    title: 'หานักศึกษาที่อยู่ร่วมกันได้อย่างปลอดภัย',
    description: 'เริ่มจาก consent, คุยกับ AI agent, ดูคู่ที่เหมาะ และรอครอบครัวกับ operator อนุมัติ',
    bullets: ['ปุ่มใหญ่ อ่านง่าย', 'มีครอบครัวร่วมอนุมัติ', 'นักศึกษาไม่ใช่ผู้ดูแลทางการแพทย์'],
  },
  student: {
    label: 'นักศึกษา',
    title: 'หาบ้านที่เข้ากับชีวิตเรียนและขอบเขตชัดเจน',
    description: 'ระบบช่วยดูจังหวะชีวิต ค่าเดินทาง ความเป็นส่วนตัว และสร้างข้อตกลงก่อนทดลองอยู่จริง',
    bullets: ['ลดค่าหอ', 'ขอบเขต companion ชัดเจน', 'มี operator ตรวจความปลอดภัย'],
  },
};

export const onboardingByRole: Record<
  UserRole,
  {
    agentName: string;
    consentChecklist: string[];
    profileItems: Array<{ label: string; value: string }>;
    interviewTurns: Array<{ speaker: 'agent' | 'user'; title: string; text: string }>;
    kizunaProfile: KizunaDimension[];
    candidates: MatchCandidate[];
    approvalChecks: string[];
    successTitle: string;
    successCopy: string;
  }
> = {
  elder: {
    agentName: 'Elder Voice Agent',
    consentChecklist: [
      'ยินยอมให้ AI ช่วยสรุปข้อมูลเพื่อการจับคู่',
      'ข้อมูลที่ส่งให้ครอบครัวเป็น privacy-safe summary เท่านั้น',
      'ต้องมีเบอร์ติดต่อฉุกเฉินและคนในครอบครัวร่วมอนุมัติ',
      'นักศึกษาเป็น companion ไม่ใช่ผู้ดูแลทางการแพทย์',
      'สามารถขอหยุดหรือขอ rematch ได้ตลอดช่วงทดลอง',
    ],
    profileItems: [
      { label: 'ชื่อ', value: 'คุณยายสมศรี' },
      { label: 'อายุ', value: '72 ปี' },
      { label: 'พื้นที่บ้าน', value: 'ลาดพร้าว ใกล้ MRT' },
      { label: 'ห้องว่าง', value: 'ห้องนอนชั้น 2 มีห้องน้ำใกล้กัน' },
      { label: 'คนอนุมัติร่วม', value: 'ลูกสาวและ operator' },
    ],
    interviewTurns: [
      {
        speaker: 'agent',
        title: 'Elder Voice Agent',
        text: 'ปกติคุณยายอยากมีเพื่อนคุยช่วงเวลาไหนมากที่สุดคะ',
      },
      {
        speaker: 'user',
        title: 'คุณยายสมศรี',
        text: 'ช่วงเย็นหลังทานข้าวค่ะ อยากมีคนทักทายบ้าง แต่กลางคืนขอให้บ้านเงียบ',
      },
      {
        speaker: 'agent',
        title: 'Elder Voice Agent',
        text: 'ถ้านักศึกษากลับดึกเป็นบางวัน คุณยายอยากให้แจ้งล่วงหน้าแบบไหนคะ',
      },
      {
        speaker: 'user',
        title: 'คุณยายสมศรี',
        text: 'แจ้งก่อน 22:00 ก็สบายใจค่ะ และให้ลูกสาวเห็นข้อความด้วย',
      },
    ],
    kizunaProfile: [
      { label: 'Rhythm', value: 88, detail: 'ชอบกิจวัตรเย็นและบ้านเงียบหลัง 21:30' },
      { label: 'Privacy', value: 84, detail: 'ต้องการพื้นที่ส่วนตัว แต่เปิดรับการทักทายสั้นๆ' },
      { label: 'Communication', value: 92, detail: 'ต้องการแจ้งล่วงหน้าชัดเจนเมื่อกลับดึก' },
      { label: 'Meals', value: 78, detail: 'ยินดีทานข้าวร่วมกัน 2-3 ครั้งต่อสัปดาห์' },
      { label: 'Care Boundary', value: 96, detail: 'เข้าใจว่านักศึกษาไม่ใช่ caregiver' },
    ],
    candidates: [
      {
        id: 'ton',
        name: 'ต้น',
        initials: 'ต',
        headline: '19, ม.มหิดล',
        location: 'เดินทางถึงลาดพร้าวประมาณ 35 นาที',
        compatibility: 91,
        status: 'Best match',
        summary: 'ตารางเรียนกลับก่อนค่ำเป็นส่วนใหญ่ ชอบบ้านเงียบ และเข้าใจขอบเขต companion',
        why: [
          'จังหวะชีวิตใกล้กันและไม่รบกวนช่วงกลางคืน',
          'ยอมรับมื้ออาหารร่วมกัน 2-3 ครั้งต่อสัปดาห์',
          'เข้าใจชัดเจนว่านักศึกษาไม่ใช่ผู้ดูแลทางการแพทย์',
        ],
        watchOuts: ['ช่วงสอบปลายเดือนต้องการพื้นที่อ่านหนังสือ', 'ต้องยืนยัน emergency contact 2 คน'],
        conditions: ['quiet hours 21:30-07:00', 'แจ้งหากกลับหลัง 22:00', 'ลูกสาวคุณยายร่วมอนุมัติ'],
        agreementSummary: ['นัดคุยครั้งแรกพร้อมลูกสาว', 'ทบทวนขอบเขต companion', 'รีวิวหลังทดลองอยู่ 14 วัน'],
        firstMeeting: 'พรุ่งนี้ 18:30 ผ่านวิดีโอคอลกับลูกสาวและ operator',
      },
      {
        id: 'may',
        name: 'เมย์',
        initials: 'ม',
        headline: '21, ม.เกษตรศาสตร์',
        location: 'เดินทางถึงลาดพร้าวประมาณ 50 นาที',
        compatibility: 84,
        status: 'Good backup',
        summary: 'เข้ากับกฎบ้านได้ดี แต่มีวันกลับดึกจากกิจกรรมมหาวิทยาลัย',
        why: ['สื่อสารสุภาพและยอมรับ privacy', 'ต้องการบ้านเงียบเหมือนกัน'],
        watchOuts: ['กิจกรรมมหาวิทยาลัยเลิกดึกบางวัน', 'ระยะเดินทางไกลกว่า'],
        conditions: ['ต้องแจ้งตารางกิจกรรมรายสัปดาห์', 'ตั้ง late return notice'],
        agreementSummary: ['นัดคุยก่อนเลือกเป็น backup', 'ทบทวนการกลับดึก'],
        firstMeeting: 'รอนัดหมายหลัง operator review',
      },
      {
        id: 'win',
        name: 'วิน',
        initials: 'ว',
        headline: '20, สจล.',
        location: 'เดินทางถึงลาดพร้าวประมาณ 45 นาที',
        compatibility: 79,
        status: 'Needs review',
        summary: 'มีทักษะช่วยเหลือดี แต่ตารางกลับบ้านไม่สม่ำเสมอ',
        why: ['มีประสบการณ์อยู่บ้านร่วมกับญาติผู้ใหญ่', 'ยอมรับการเช็กอินรายวัน'],
        watchOuts: ['กลับบ้านหลัง 22:00 บ่อยกว่าเกณฑ์', 'ต้องตรวจขอบเขตไม่ให้กลายเป็น caregiver'],
        conditions: ['operator ต้องสัมภาษณ์เพิ่ม', 'ต้องตั้งแผนกลับดึก'],
        agreementSummary: ['ยังไม่แนะนำเป็นคู่แรก', 'ใช้เป็น candidate สำรอง'],
        firstMeeting: 'ยังไม่เปิดนัดหมาย',
      },
    ],
    approvalChecks: [
      'Family approval required',
      'Operator review required',
      'Emergency contact verified',
      'Quiet hours added to agreement',
      'Medical-care boundary confirmed',
    ],
    successTitle: 'ได้คู่ทดลองอยู่ร่วมกันแล้ว',
    successCopy: 'ระบบแนะนำต้นเป็นคู่ทดลองแรก พร้อมเงื่อนไขความปลอดภัยและการอนุมัติจากครอบครัว',
  },
  student: {
    agentName: 'Student Life Agent',
    consentChecklist: [
      'ยินยอมให้ AI ช่วยสรุปข้อมูลเพื่อการจับคู่',
      'เข้าใจว่าบทบาทคือ companion ไม่ใช่ caregiver',
      'ยอมรับการแจ้งกลับดึกและ check-in ตามข้อตกลง',
      'ข้อมูลส่วนตัวถูกใช้เป็น privacy-safe summary เท่านั้น',
      'สามารถขอ rematch ได้หากตารางเรียนหรือความสบายใจไม่เหมาะ',
    ],
    profileItems: [
      { label: 'ชื่อ', value: 'ต้น' },
      { label: 'อายุ', value: '19 ปี' },
      { label: 'มหาวิทยาลัย', value: 'ม.มหิดล' },
      { label: 'งบที่ต้องการประหยัด', value: 'ประมาณ ฿4,500/เดือน' },
      { label: 'ตารางกลับบ้าน', value: 'ก่อน 20:30 เป็นส่วนใหญ่' },
    ],
    interviewTurns: [
      {
        speaker: 'agent',
        title: 'Student Life Agent',
        text: 'ถ้าบ้านมีกฎเรื่อง quiet hours หลัง 21:30 คุณทำได้ไหม',
      },
      {
        speaker: 'user',
        title: 'ต้น',
        text: 'ทำได้ครับ ปกติอ่านหนังสือเงียบๆ และถ้ากลับดึกจะแจ้งก่อน',
      },
      {
        speaker: 'agent',
        title: 'Student Life Agent',
        text: 'คุณเข้าใจไหมว่าบทบาทนี้ไม่ใช่งานดูแลผู้ป่วยหรือช่วยงานทางการแพทย์',
      },
      {
        speaker: 'user',
        title: 'ต้น',
        text: 'เข้าใจครับ เป็นเพื่อนบ้าน คุย ทักทาย และทำตามข้อตกลง ไม่ใช่ caregiver',
      },
    ],
    kizunaProfile: [
      { label: 'Rhythm', value: 90, detail: 'กลับบ้านก่อนค่ำเป็นส่วนใหญ่' },
      { label: 'Privacy', value: 82, detail: 'ต้องการพื้นที่ช่วงสอบ แต่สื่อสารล่วงหน้าได้' },
      { label: 'Communication', value: 88, detail: 'ยอมรับการแจ้งกลับดึกและ check-in' },
      { label: 'Meals', value: 74, detail: 'พร้อมทานข้าวร่วมกันเมื่อไม่มีสอบ' },
      { label: 'Care Boundary', value: 97, detail: 'เข้าใจ companion, not caregiver' },
    ],
    candidates: [
      {
        id: 'somsri',
        name: 'คุณยายสมศรี',
        initials: 'สศ',
        headline: '72, บ้านลาดพร้าว',
        location: 'ใกล้รถไฟฟ้า เดินทางไปมหาวิทยาลัยได้',
        compatibility: 91,
        status: 'Best match',
        summary: 'บ้านเงียบ ปลอดภัย มีครอบครัวร่วมอนุมัติ และต้องการเพื่อนคุยช่วงเย็น',
        why: [
          'กฎบ้านเข้ากับตารางเรียนและเวลาพักผ่อน',
          'ต้องการเพื่อนคุยช่วงเย็น ไม่ใช่ caregiver',
          'ช่วยลดค่าหอโดยยังมีขอบเขตที่ชัดเจน',
        ],
        watchOuts: ['ต้องแจ้งถ้ากลับหลัง 22:00', 'ช่วงสอบต้องคุยเรื่องพื้นที่ส่วนตัวล่วงหน้า'],
        conditions: ['quiet hours 21:30-07:00', 'แจ้งกลับดึกให้คุณยายและลูกสาว', 'รีวิวหลัง 14 วัน'],
        agreementSummary: ['ประหยัดค่าหอ ฿4,500/เดือน', 'ทานข้าวร่วมกันเมื่อสะดวก', 'ไม่รับหน้าที่ดูแลทางการแพทย์'],
        firstMeeting: 'พรุ่งนี้ 18:30 ผ่านวิดีโอคอลกับลูกสาวคุณยายและ operator',
      },
      {
        id: 'anong',
        name: 'คุณป้าอนงค์',
        initials: 'อ',
        headline: '68, บ้านอารีย์',
        location: 'เดินทางสะดวก แต่ห้องเล็กกว่า',
        compatibility: 83,
        status: 'Good backup',
        summary: 'ทำเลดีและขอบเขตชัด แต่ต้องการคนกลับบ้านเร็วกว่า 20:00',
        why: ['บ้านใกล้รถไฟฟ้า', 'ครอบครัว support ดี'],
        watchOuts: ['เวลากลับบ้านอาจไม่ตรงบางวัน', 'พื้นที่ส่วนตัวน้อยกว่า'],
        conditions: ['ต้องยืนยันตารางเรียนรายสัปดาห์', 'คุยเรื่องเวลาปิดไฟ'],
        agreementSummary: ['เหมาะเป็นตัวเลือกสำรอง', 'ต้องคุยกฎบ้านเพิ่ม'],
        firstMeeting: 'รอนัดหมายหลัง operator review',
      },
      {
        id: 'prasert',
        name: 'คุณลุงประเสริฐ',
        initials: 'ป',
        headline: '75, บ้านบางนา',
        location: 'บ้านกว้าง แต่เดินทางไกล',
        compatibility: 76,
        status: 'Needs review',
        summary: 'พื้นที่ดีมาก แต่เดินทางไม่เหมาะกับตารางเรียนเช้า',
        why: ['บ้านมีพื้นที่ส่วนตัวสูง', 'ต้องการ companion ชัดเจน'],
        watchOuts: ['เดินทางไกล', 'มีนัดแพทย์บ่อย ต้องระวัง boundary'],
        conditions: ['operator ต้องทบทวน care boundary', 'ต้องตรวจเวลาเดินทาง'],
        agreementSummary: ['ยังไม่แนะนำเป็นคู่แรก', 'เก็บไว้เป็น candidate สำรอง'],
        firstMeeting: 'ยังไม่เปิดนัดหมาย',
      },
    ],
    approvalChecks: [
      'Family approval required',
      'Operator review required',
      'Emergency contact verified',
      'Late return notice enabled',
      'Companion boundary confirmed',
    ],
    successTitle: 'ได้บ้านทดลองอยู่ร่วมกันแล้ว',
    successCopy: 'ระบบแนะนำบ้านคุณยายสมศรีเป็นคู่ทดลองแรก พร้อมข้อตกลงเรื่องเวลาเงียบและการแจ้งกลับดึก',
  },
};
