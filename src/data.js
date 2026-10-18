// All page content lives here, so you can edit text without touching components.
// Fees, dates, reviews and names are SAMPLE values until you replace them.

export const SITE = {
  name: 'Nexvara Technology',
  tagline: 'Learn · Build · Grow',
  deadline: '2026-10-31T23:59:59+05:30',
  deadlineLabel: '31 Oct 2026',
};

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Programs', to: '/programs' },
  { label: 'Courses', to: '/courses' },
  { label: 'Resources', to: '/resources' },
  // { label: 'For Partners', to: '/partners' },
  { label: 'Contact', to: '/contact' },
];

export const ANNOUNCEMENTS = [
  'New batches start 3 Nov 2026: .NET, React, Python, Data Analytics',
  'Applications close 31 Oct 2026',
  'Summer Training 2027 pre-registration is open',
  'Verify any certificate online with its ID',
];

export const HERO_STATS = [
  { to: 5, label: 'Program types' },
  { to: 8, label: 'Course tracks' },
  { to: 10, label: 'Degree streams' },
  { to: 100, suffix: '%', label: 'Hands-on projects' },
];

export const ORBIT = ['.NET', 'React', 'Java', 'Python', 'AI/ML', 'SQL'];

export const PROGRAMS = [
  {
    id: 'summer', title: 'Summer Training', icon: 'sun', c: '#B97800', cs: 'var(--amber-soft)',
    summary: 'A focused sprint during your break. Learn one stack and finish with a graded mini project.',
    duration: '4 to 8 weeks', mode: 'Online, Offline, Hybrid', eligibility: 'B.Tech, BCA, Diploma, B.Sc (1st to 3rd year)', fee: 'From ₹4,999*',
    points: ['Fixed daily schedule with doubt sessions', 'Graded mini project on GitHub', 'Certificate on meeting completion criteria'],
  },
  {
    id: 'internship', title: 'Internship', icon: 'briefcase', c: 'var(--blue)', cs: 'var(--sky)',
    summary: 'Work on a real project with a mentor, weekly code reviews and a final presentation.',
    duration: '2 to 6 months', mode: 'Hybrid, Remote', eligibility: 'Pre-final and final-year students, MCA, MBA', fee: 'From ₹6,999*',
    points: ['Selection by short assessment and interview', 'Weekly pull-request reviews', 'Internship letter after completion'],
  },
  {
    id: 'apprenticeship', title: 'Apprenticeship', icon: 'trend', c: 'var(--mint)', cs: 'var(--mint-soft)',
    summary: 'A longer, structured path where you learn on the job and take on growing responsibility.',
    duration: '6 to 12 months', mode: 'On-site, Hybrid', eligibility: 'Diploma holders and recent graduates', fee: 'Confirmed at selection*',
    points: ['Learning plan with quarterly reviews', 'Rotation across two project teams', 'Documented skills record at the end'],
  },
  {
    id: 'industrial', title: 'Industrial Training', icon: 'factory', c: 'var(--coral)', cs: 'var(--coral-soft)',
    summary: "Structured training that follows your college's industrial training requirements, with a report and certificate.",
    duration: '4 to 6 weeks', mode: 'On-site, Hybrid', eligibility: 'B.Tech and Diploma students (confirm with your department)', fee: 'From ₹5,999*',
    points: ['Training report template included', 'Attendance record for your college', 'Project demo on the last day'],
  },
  {
    id: 'project', title: 'Project-Based Learning', icon: 'folder', c: 'var(--blue-deep)', cs: 'var(--sky-2)',
    summary: 'Pick a real problem, plan it with a mentor and build it end to end. A strong fit for final-year projects.',
    duration: '8 to 12 weeks', mode: 'Online, Hybrid', eligibility: 'Any year, any listed degree', fee: 'From ₹7,999*',
    points: ['Project scoping and weekly milestones', 'Source code, documentation and demo', 'Final viva with a mentor panel'],
  },
];

export const COURSE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dev', label: 'Development' },
  { id: 'data', label: 'Data and AI' },
  { id: 'ops', label: 'Cloud and Testing' },
];

export const COURSES = [
  { mono: 'devicon-dotnetcore-plain colored', title: '.NET Full Stack', desc: 'Build secure web apps with Clean Architecture, CQRS and a React front end.', tags: ['C#', 'ASP.NET Core', 'SQL Server'], weeks: 12, level: 'Intermediate', cat: ['dev'], c: '#5B3FD4', cs: '#ECE8FB' },
  { mono: 'devicon-java-plain colored', title: 'Java Backend', desc: 'Design REST APIs with Spring Boot, JPA and clean database models.', tags: ['Java', 'Spring Boot', 'MySQL'], weeks: 12, level: 'Intermediate', cat: ['dev'], c: 'var(--coral)', cs: 'var(--coral-soft)' },
  { mono: 'devicon-react-original colored', title: 'React and Next.js', desc: 'Create fast, responsive interfaces with components, hooks and server rendering.', tags: ['React', 'TypeScript', 'Next.js'], weeks: 10, level: 'Beginner+', cat: ['dev'], c: '#0E86A8', cs: '#DDF2F8' },
  { mono: 'devicon-python-plain colored', title: 'Python Programming', desc: 'Start from zero and move to scripts, APIs and automation you will actually use.', tags: ['Python', 'OOP', 'Flask'], weeks: 8, level: 'Beginner', cat: ['dev', 'data'], c: '#B97800', cs: 'var(--amber-soft)' },
  { mono: 'devicon-tensorflow-original colored', title: 'AI and Machine Learning', desc: 'Train, test and deploy models on real datasets, with clear evaluation habits.', tags: ['scikit-learn', 'TensorFlow', 'MLOps basics'], weeks: 12, level: 'Intermediate', cat: ['data'], c: 'var(--mint)', cs: 'var(--mint-soft)' },
  { mono: 'devicon-pandas-plain colored', title: 'Data Analytics', desc: 'Clean data, write SQL and publish dashboards that managers can act on.', tags: ['Excel', 'SQL', 'Power BI'], weeks: 10, level: 'Beginner', cat: ['data'], c: 'var(--blue)', cs: 'var(--sky)' },
  { mono: 'devicon-azure-plain colored', title: 'Cloud and DevOps', desc: 'Deploy apps with containers and pipelines on a major cloud platform.', tags: ['Azure or AWS', 'Docker', 'CI/CD'], weeks: 10, level: 'Intermediate', cat: ['ops'], c: '#0E86A8', cs: '#DDF2F8' },
  { mono: 'devicon-selenium-original colored', title: 'Software Testing', desc: 'Manual and automated testing, API checks and bug reports developers can use.', tags: ['Selenium', 'API testing', 'Jira'], weeks: 8, level: 'Beginner', cat: ['ops'], c: 'var(--coral)', cs: 'var(--coral-soft)' },
];

export const STREAMS = {
  'B.Tech': { note: 'Pre-final and final-year engineers who want job-ready skills and a strong project.', programs: [['Industrial Training', '4 to 6 weeks', 'Structured training for your college requirement. Confirm rules with your department.'], ['Summer Training', '4 to 8 weeks', 'Learn one stack and finish a graded mini project.'], ['Internship', '2 to 6 months', 'Work on a mentor-reviewed project.'], ['Project-Based Learning', '8 to 12 weeks', 'Build your final-year project the right way.']], courses: ['.NET', 'Java', 'React', 'AI/ML', 'Cloud'] },
  'M.Tech': { note: 'Postgraduate engineers moving into applied research, data and cloud roles.', programs: [['Internship', '2 to 6 months', 'Apply your specialisation to a real build.'], ['Project-Based Learning', '8 to 12 weeks', 'Turn a thesis idea into a working prototype.']], courses: ['AI/ML', 'Cloud', 'Data Analytics'] },
  Diploma: { note: 'Diploma students building a practical base for jobs or lateral entry.', programs: [['Industrial Training', '4 to 6 weeks', 'Hands-on training with a proper report.'], ['Apprenticeship', '6 to 12 months', 'Learn on the job with a growing role.'], ['Summer Training', '4 to 8 weeks', 'A first stack, from basics to a mini project.']], courses: ['Python', 'Java', 'Testing', 'React'] },
  BCA: { note: 'BCA students who want to code confidently before they graduate.', programs: [['Summer Training', '4 to 8 weeks', 'Pick a stack and build your first full project.'], ['Internship', '2 to 6 months', 'Get used to reviews, deadlines and teamwork.'], ['Project-Based Learning', '8 to 12 weeks', 'Build a portfolio piece for interviews.']], courses: ['.NET', 'React', 'Python', 'Testing'] },
  MCA: { note: 'MCA students aiming at full-stack, cloud or data roles.', programs: [['Internship', '2 to 6 months', 'Ship features with mentor reviews.'], ['Project-Based Learning', '8 to 12 weeks', 'Plan and deliver a complete application.'], ['Apprenticeship', '6 to 12 months', 'A longer path with real responsibility.']], courses: ['.NET', 'Java', 'Cloud', 'AI/ML'] },
  'B.Sc': { note: 'B.Sc students in IT, computer science, maths or statistics.', programs: [['Summer Training', '4 to 8 weeks', 'Learn programming and data skills step by step.'], ['Internship', '2 to 6 months', 'Practise on real datasets and small apps.']], courses: ['Python', 'Data Analytics', 'Testing'] },
  'M.Sc': { note: 'M.Sc students who want to apply theory to real data and software.', programs: [['Internship', '2 to 6 months', 'Work on analytics or machine learning tasks.'], ['Project-Based Learning', '8 to 12 weeks', 'Build an end-to-end data project.']], courses: ['Data Analytics', 'AI/ML', 'Python'] },
  BBA: { note: 'BBA students adding data and technology skills to business knowledge.', programs: [['Summer Training', '4 to 8 weeks', 'Learn spreadsheets, SQL and dashboards.'], ['Internship', '2 to 6 months', 'Support a real reporting or analysis project.']], courses: ['Data Analytics', 'Excel and Power BI'] },
  MBA: { note: 'MBA students who want to read, build and present data with confidence.', programs: [['Internship', '2 to 6 months', 'Own an analysis from question to presentation.'], ['Project-Based Learning', '8 to 12 weeks', 'Solve a business problem with data.']], courses: ['Data Analytics', 'Product analytics'] },
  Other: { note: 'Studying something else? Talk to our counselling desk and we will check eligibility with you.', programs: [['All programs', 'Varies', 'Eligibility is reviewed case by case.']], courses: ['Any track'] },
};

export const STEPS = [
  { title: 'Choose a program', text: 'Match your degree and goals using the cards above.' },
  { title: 'Apply', text: 'Fill a short form. No payment is taken at this stage.' },
  { title: 'Get confirmation', text: 'We confirm eligibility, batch dates and fee in writing.' },
  { title: 'Learn and build', text: 'Attend sessions and ship projects with mentor reviews.' },
  { title: 'Complete assessment', text: 'Take the final test and present your project.' },
  { title: 'Receive certificate', text: 'Eligible students get a certificate with a verifiable ID.' },
];

export const PROJECTS = [
  { level: 'Intermediate', title: 'Student Result Portal', text: 'Role-based login, marks entry and downloadable report cards.', tags: ['.NET 9', 'SQL Server', 'React'] },
  { level: 'Beginner+', title: 'Expense Tracker', text: 'Track budgets by category and view monthly charts.', tags: ['React', 'Node', 'Charts'] },
  { level: 'Beginner', title: 'Sales Insights Dashboard', text: 'Clean raw sales data and publish a KPI dashboard.', tags: ['SQL', 'Power BI'] },
  { level: 'Intermediate', title: 'Spam Message Classifier', text: 'Train, evaluate and deploy a small machine learning model.', tags: ['Python', 'scikit-learn'] },
];

export const REPO_ROWS = [
  ['folder', 'src/', 'feat: add login flow'],
  ['folder', 'tests/', 'test: marks validation'],
  ['file', 'README.md', 'docs: setup guide'],
  ['file', '.github/workflows/ci.yml', 'ci: run tests'],
];

export const ASSIGNMENTS = [
  ['Week 1: Build a REST API', 'Create, read, update and delete with validation'],
  ['Week 2: Connect a database', 'Design tables and write migrations'],
  ['Week 3: Build the user interface', 'Forms, lists and error states'],
  ['Week 4: Add authentication', 'Login, roles and protected pages'],
  ['Week 5: Write tests', 'Unit tests for the main business rules'],
  ['Week 6: Deploy and document', 'Publish the app and finish the README'],
];

export const PARTNER_MODES = [
  { icon: 'briefcase', c: 'var(--blue)', cs: 'var(--sky)', title: 'Hiring partners', text: 'Companies that interview our students for internships and jobs.' },
  { icon: 'cap', c: 'var(--mint)', cs: 'var(--mint-soft)', title: 'Training partners', text: 'Organisations that run or co-deliver a partner-led program.' },
  { icon: 'link', c: '#B97800', cs: 'var(--amber-soft)', title: 'Academic partners', text: 'Colleges and universities that send batches for training.' },
];

export const CERTS = {
  'INST-26-00142': ['Student Name', '.NET Full Stack Program', '12 Aug 2026'],
  'INST-26-00177': ['Student Name', 'Data Analytics Program', '02 Sep 2026'],
  'INST-26-00201': ['Student Name', 'Python Programming', '19 Sep 2026'],
};

export const CRITERIA = [
  'At least 75% attendance in live sessions',
  'Pass the final assessment with 60% or more',
  'Submit the final project with source code',
  'Fees cleared and course feedback submitted',
];

export const POSTS = [
  { icon: 'cap', cat: 'Career guidance', title: 'How to choose the right training program in your third year', read: '8 min read', c: 'var(--blue)', cs: 'var(--sky)', big: true },
  { icon: 'msg', cat: 'Interview prep', title: '20 .NET interview questions you should be able to answer', read: '10 min read', c: 'var(--coral)', cs: 'var(--coral-soft)' },
  { icon: 'code', cat: 'Tutorial', title: 'Build a REST API with ASP.NET Core in 30 minutes', read: '12 min read', c: 'var(--mint)', cs: 'var(--mint-soft)' },
  { icon: 'folder', cat: 'Project ideas', title: '10 project ideas that recruiters remember', read: '7 min read', c: '#B97800', cs: 'var(--amber-soft)' },
  { icon: 'mail', cat: 'Internship tips', title: 'An internship application email that gets replies', read: '5 min read', c: 'var(--blue-deep)', cs: 'var(--sky-2)' },
];

export const FAQ = {
  s: [
    ['Who can apply?', 'Students from B.Tech, M.Tech, Diploma, BCA, MCA, B.Sc, M.Sc, BBA and MBA programs. Each program card lists its own eligibility.'],
    ['Do I need coding experience?', 'Not for beginner tracks such as Python, Data Analytics and Testing. Intermediate tracks list their prerequisites on the course page.'],
    ['Will I get a certificate?', 'Eligible students receive a certificate with a unique ID once they meet the attendance, assessment and project criteria.'],
    ['Can I learn online?', 'Mode depends on the program. Check the Mode row on each program card for online, offline or hybrid options.'],
    ['How are my projects reviewed?', 'Mentors review your work through pull requests every week and talk it through in live sessions.'],
  ],
  p: [
    ["How can I track my child's progress?", 'A progress view covers attendance, assignments and project milestones. Parents can request a summary from the counselling desk.'],
    ['What are the fees and payment options?', 'Fees are shown on each program. Payment options, if any, are confirmed in writing before enrolment.'],
    ['What is the refund policy?', 'The full policy, with the exact window and any deductions, is shared in writing before you pay.'],
    ['Who can I contact during the program?', 'Every batch has a named coordinator whom parents can contact during support hours.'],
    ['Can we speak to a counsellor first?', 'Yes. Use the counselling button on this page to book a free call before you apply.'],
  ],
};

export const SHOTS = [
  { title: 'Sales Insights Dashboard', tags: ['SQL', 'Power BI'], who: 'Student Name, BBA 3rd year', c: 'var(--blue)', cs: 'var(--sky-2)', kind: 'bars', bars: [40, 70, 55, 90, 65] },
  { title: 'Result Management Portal', tags: ['.NET', 'React'], who: 'Student Name, B.Tech CSE final year', c: 'var(--mint)', cs: 'var(--mint-soft)', kind: 'rows', bars: [90, 70, 80, 45] },
  { title: 'Spam Message Classifier', tags: ['Python', 'ML'], who: 'Student Name, MCA 2nd year', c: '#B97800', cs: 'var(--amber-soft)', kind: 'bars', bars: [85, 60, 75, 35, 50] },
];

export const REVIEWS = [
  { text: 'The weekly code reviews changed how I write code. My final project went on GitHub with a proper README.', name: 'Student Name', role: 'B.Tech CSE, Summer Training', init: 'SN', c: '#2A1B00', bg: 'var(--amber)' },
  { text: 'I started with no Python background. The assignments were small enough to finish and hard enough to teach me.', name: 'Student Name', role: 'BCA, Project-Based Learning', init: 'SN', c: 'var(--blue-deep)', bg: 'var(--sky-2)' },
  { text: 'The mock interview showed me gaps I did not know I had. I fixed them before my first real interview.', name: 'Student Name', role: 'MCA, Internship', init: 'SN', c: 'var(--mint)', bg: 'var(--mint-soft)' },
  { text: 'As a parent, I liked getting a clear progress summary. It showed attendance and what my child had built.', name: 'Parent Name', role: 'Parent of a Diploma student', init: 'PN', c: 'var(--coral)', bg: 'var(--coral-soft)' },
];

export const ACHIEVEMENTS = [
  ['award', 'Hackathon finalist'],
  ['github', 'Open-source pull request merged'],
  ['briefcase', 'Internship offer received'],
  ['book', 'Project documented and published'],
];

export const QUALIFICATIONS = ['B.Tech', 'M.Tech', 'Diploma', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'BBA', 'MBA', 'Other'];
export const PROGRAM_OPTIONS = ['Summer Training', 'Internship', 'Apprenticeship', 'Industrial Training', 'Project-Based Learning', 'Not sure (counselling)', 'Partnership enquiry'];

export const CONTACT = [
  ['phone', 'Phone', '+91 88407 57589'],
  ['mail', 'Email', 'info.nexvara@gmail.com'],
  ['pin', 'Lucknow', 'Institute address line, City, State, PIN'],
  ['clock', 'Hours', 'Mon to Sat, 10:00 AM to 6:00 PM'],
];

export const FOOTER_COLS = [
  ['Quick links', [['Programs', '#programs'], ['Courses', '#courses'], ['Verify Certificate', '#certificates'], ['Blogs', '#resources'], ['For Partners', '#partners']]],
  ['Programs', [['Summer Training', '#programs'], ['Internship', '#programs'], ['Apprenticeship', '#programs'], ['Industrial Training', '#programs'], ['Project-Based Learning', '#programs']]],
  ['Policies', [['Privacy Policy'], ['Terms and Conditions'], ['Refund Policy'], ['Student Code of Conduct'], ['FAQs', '#corner']]],
];
