// About page content. Edit text here without touching the component.
// Team names, quotes and anything marked SAMPLE are placeholders until you replace them.

export const ABOUT_SEO = {
  title: 'About Us | Mentor-Led IT Training, Internships & Projects',
  description:
    'Learn who we are, what we believe and how we train students. Mentor-led summer training, internships, apprenticeships and project-based learning with weekly code reviews and verifiable certificates.',
};

export const WHO = {
  eyebrow: 'Who we are',
  title: 'A training institute built around one idea: you learn by building.',
  paras: [
    'We are a mentor-led IT training institute for students and early-career learners. Instead of long lectures, every program is organised around real projects, weekly reviews and clear feedback, so you finish with working code and a portfolio you can explain in an interview.',
    'Our trainers are working developers who teach the way teams actually build software: version control, pull requests, testing, documentation and deployment. That is the difference between knowing a language and being ready for a job.',
  ],
  points: [
    ['code', 'Industry practice, from day one', 'Git, code reviews, testing and deployment are part of every course.'],
    ['users', 'Mentors who stay accountable', 'Every batch has a named coordinator and a weekly review slot.'],
    ['shield', 'Honest, written commitments', 'Fees, dates and certificate criteria are confirmed in writing.'],
  ],
};

export const MV = [
  {
    icon: 'target',
    tag: 'Our mission',
    title: 'Make job-ready skills accessible and practical',
    text: 'To give every student a clear, affordable path from classroom theory to real project experience, with mentors who review their work and certificates that employers can verify.',
    c: 'var(--blue)', cs: 'var(--sky)',
  },
  {
    icon: 'star',
    tag: 'Our vision',
    title: 'A graduate pipeline that companies trust',
    text: 'To become the institute that colleges recommend and hiring teams trust, known for students who can read a codebase, ship a feature and explain their decisions.',
    c: '#B97800', cs: 'var(--amber-soft)',
  },
];

export const VALUES = ['Practice before theory', 'Feedback every week', 'Transparent fees and policies', 'Student outcomes over marketing', 'Open source mindset'];

export const WHY = [
  { icon: 'users', title: 'Mentor-led, not video-led', text: 'Live sessions, doubt solving and one-to-one feedback from working developers.', c: 'var(--blue)', cs: 'var(--sky)' },
  { icon: 'code', title: 'Real projects, reviewed weekly', text: 'Every learner builds on GitHub and gets pull-request reviews, just like on a product team.', c: 'var(--mint)', cs: 'var(--mint-soft)' },
  { icon: 'briefcase', title: 'Industry-aligned curriculum', text: '.NET, Java, React, Python, AI/ML, Data and Cloud tracks that mirror current job descriptions.', c: '#B97800', cs: 'var(--amber-soft)' },
  { icon: 'shield', title: 'Verifiable certificates', text: 'Each certificate carries a unique ID that anyone can check online.', c: 'var(--coral)', cs: 'var(--coral-soft)' },
  { icon: 'laptop', title: 'Flexible learning modes', text: 'Online, offline and hybrid options so college timetables never block your learning.', c: 'var(--blue-deep)', cs: 'var(--sky-2)' },
  { icon: 'trend', title: 'Career support that is honest', text: 'Resume reviews, mock interviews and project walkthroughs. We prepare you, we do not promise jobs.', c: 'var(--mint)', cs: 'var(--mint-soft)' },
];

export const PROCESS = [
  { icon: 'search', title: 'Discover', text: 'A short counselling call to understand your degree, year, goals and current skill level.' },
  { icon: 'file', title: 'Plan', text: 'We recommend a program and track, then confirm eligibility, batch dates and fees in writing.' },
  { icon: 'book', title: 'Learn', text: 'Live sessions with small daily assignments that turn each concept into working code.' },
  { icon: 'code', title: 'Build', text: 'You pick or get a real project and build it in milestones, with your code on GitHub.' },
  { icon: 'msg', title: 'Review', text: 'Weekly code reviews, mock interviews and feedback so you keep improving.' },
  { icon: 'award', title: 'Certify', text: 'Pass the assessment, present your project and receive a certificate with a verifiable ID.' },
];

export const AUDIENCES = [
  { id: 'btech', label: 'B.Tech and Diploma', note: 'Engineering and diploma students who need industrial training, a strong final-year project and job-ready skills.', programs: ['Industrial Training', 'Summer Training', 'Internship', 'Project-Based Learning'] },
  { id: 'comp', label: 'BCA and MCA', note: 'Computer application students who want to code confidently and build a portfolio before graduation.', programs: ['Summer Training', 'Internship', 'Project-Based Learning', 'Apprenticeship'] },
  { id: 'sci', label: 'B.Sc and M.Sc', note: 'Science and maths students moving into data, analytics and programming roles.', programs: ['Summer Training', 'Internship', 'Project-Based Learning'] },
  { id: 'mgmt', label: 'BBA and MBA', note: 'Management students adding data, dashboards and technology skills to business knowledge.', programs: ['Summer Training', 'Internship'] },
  { id: 'grad', label: 'Recent graduates', note: 'Graduates who want a structured, longer path with real responsibility before their first job.', programs: ['Apprenticeship', 'Internship', 'Project-Based Learning'] },
];

// SAMPLE team. Replace names, roles and skills with your real mentors.
export const TEAM = [
  { name: 'Mentor Name', role: 'Lead Trainer, .NET and Cloud', init: 'MN', skills: ['C#', 'ASP.NET Core', 'Azure'], exp: '10+ years in industry', c: 'var(--blue)', cs: 'var(--sky)' },
  { name: 'Mentor Name', role: 'Senior Mentor, React and Frontend', init: 'MN', skills: ['React', 'TypeScript', 'UI'], exp: '8+ years in industry', c: 'var(--mint)', cs: 'var(--mint-soft)' },
  { name: 'Mentor Name', role: 'Mentor, Data and AI/ML', init: 'MN', skills: ['Python', 'SQL', 'ML'], exp: '7+ years in industry', c: '#B97800', cs: 'var(--amber-soft)' },
  { name: 'Mentor Name', role: 'Career and Counselling Lead', init: 'MN', skills: ['Mock interviews', 'Resumes', 'Guidance'], exp: 'Student success', c: 'var(--coral)', cs: 'var(--coral-soft)' },
];

export const ABOUT_FAQ = [
  ['What does your institute do?', 'We run mentor-led IT training programs: summer training, internships, apprenticeships, industrial training and project-based learning, across development, data, AI and cloud tracks.'],
  ['Who can join your programs?', 'Students from B.Tech, M.Tech, Diploma, BCA, MCA, B.Sc, M.Sc, BBA and MBA, plus recent graduates. Each program lists its own eligibility.'],
  ['Do I need prior coding experience?', 'Not for beginner tracks such as Python, Data Analytics and Software Testing. Intermediate tracks list their prerequisites clearly before you apply.'],
  ['How is learning here different from online video courses?', 'You learn with live mentors, small assignments, weekly pull-request reviews and a final project presentation, so you get feedback instead of watching alone.'],
  ['Will I receive a certificate?', 'Yes. Students who meet the attendance, assessment and project criteria receive a certificate with a unique ID that can be verified online.'],
  ['Do you guarantee placement?', 'No. We do not promise jobs. We prepare you with real projects, resume reviews and mock interviews so you can perform well in interviews.'],
  ['Can I learn online or offline?', 'Mode depends on the program. Online, offline and hybrid options are listed on each program card.'],
  ['How do I apply?', 'Use the Apply Now button, fill the short form and our team will confirm eligibility, batch dates and fees in writing. No payment is taken at the application stage.'],
];

export const CTA = {
  title: 'Ready to build skills that show up in your portfolio?',
  text: 'Apply in two minutes, or talk to a counsellor first. No payment is taken at the application stage.',
};
