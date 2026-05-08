export type UserRole = 'elder' | 'student';
export type ElderTab = 'home' | 'checkin' | 'agreement' | 'report';
export type StudentTab = 'home' | 'tasks' | 'agreement' | 'report';

export const elderProfile = {
  name: 'คุณยายสมศรี',
  age: 72,
  home: 'บ้านลาดพร้าว',
  housemate: 'ต้น',
  returnTime: '20:30',
  aiNote: 'วันนี้อากาศร้อน ดื่มน้ำบ่อยๆ นะคะ ต้นจะกลับบ้านประมาณ 20:30',
  status: 'อยู่บ้าน',
};

export const studentProfile = {
  name: 'ต้น',
  age: 19,
  university: 'ม.มหิดล',
  home: 'บ้านลาดพร้าว',
  rentSaved: '฿4,500/เดือน',
  elderName: 'คุณยายสมศรี',
  elderMood: 'อารมณ์ดี',
  aiNudge: 'คุณยายเงียบกว่าปกติ ลองแวะทักทายตอนเย็นไหม',
};

export const agreementClauses = [
  'แจ้งถ้ากลับหลัง 22:00',
  'เวลาเงียบ 21:30-07:00',
  'ทานข้าวร่วมกัน 2-3 ครั้ง/สัปดาห์เมื่อสะดวก',
  'แจ้งเหตุฉุกเฉินผ่านครอบครัวและ operator',
  'นักศึกษาไม่ใช่ผู้ดูแลทางการแพทย์',
  'ทั้งสองฝ่ายขอพักหรือขอ rematch ได้',
];

export const elderCheckInOptions = [
  { id: 'good', label: 'ดี', detail: 'สบายใจ' },
  { id: 'okay', label: 'เฉยๆ', detail: 'ปกติ' },
  { id: 'low', label: 'ไม่ค่อยดี', detail: 'อยากให้ช่วย' },
];

export const studentTasks = [
  { id: 'greet', label: 'ทักทายคุณยายตอนเย็น', detail: 'ใช้เวลา 5 นาที', done: true },
  { id: 'meal', label: 'ทานข้าวร่วมกัน', detail: 'วันนี้ 18:30', done: false },
  { id: 'late', label: 'แจ้งถ้ากลับหลัง 22:00', detail: 'ตามข้อตกลง', done: false },
  { id: 'boundary', label: 'ยืนยันขอบเขต companion', detail: 'not caregiver', done: true },
];

export const wellnessReport = {
  recommendation: 'Continue Pilot',
  metrics: [
    { label: 'Check-ins', value: '13/14' },
    { label: 'Shared meals', value: '5' },
    { label: 'Comfort', value: '4.4/5' },
    { label: 'Safety', value: '0 incident' },
  ],
  elderSummary: [
    'รู้สึกสบายใจขึ้นหลังสัปดาห์ที่สอง',
    'ยังต้องรักษาเวลาเงียบหลัง 21:30',
    'ไม่มีเหตุด้านความปลอดภัย',
  ],
  studentSummary: [
    'ตารางเรียนยังเข้ากับกฎบ้านได้',
    'ช่วยลดค่าหอและมีบ้านที่ปลอดภัย',
    'ช่วงสอบควรลดกิจกรรมร่วมกันชั่วคราว',
  ],
  chart: [32, 40, 48, 52, 63, 70, 78, 86],
};
