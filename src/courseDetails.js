// Back-of-card details for each course. Keys match COURSES[].title in data.js.
// Edit freely. Syllabus items are examples until your final syllabus is confirmed.
export const COURSE_DETAILS = {
  '.NET Full Stack': {
    badge: 'Trending',
    modules: ['C# and OOP fundamentals', 'ASP.NET Core Web API with Clean Architecture', 'CQRS, MediatR and EF Core', 'SQL Server design and queries', 'React front end with JWT login'],
    build: 'A role-based student result portal',
    roles: ['.NET Developer', 'Full Stack Developer', 'Backend Engineer'],
    prereq: 'Basic programming logic',
  },
  'Java Backend': {
    badge: 'Evergreen',
    modules: ['Core Java and collections', 'Spring Boot REST APIs', 'JPA, Hibernate and MySQL', 'Security and validation', 'Testing and deployment'],
    build: 'An e-commerce order management API',
    roles: ['Java Developer', 'Backend Engineer', 'API Developer'],
    prereq: 'Basics of any one programming language',
  },
  'React and Next.js': {
    badge: 'Most popular',
    modules: ['Modern JavaScript and TypeScript', 'Components, hooks and state', 'Routing and data fetching', 'Next.js server rendering', 'Performance and deployment'],
    build: 'A responsive analytics dashboard',
    roles: ['Frontend Developer', 'React Developer', 'UI Engineer'],
    prereq: 'HTML, CSS and basic JavaScript',
  },
  'Python Programming': {
    badge: 'Beginner pick',
    modules: ['Syntax, data types and control flow', 'Functions, OOP and file handling', 'APIs and JSON', 'Flask web basics', 'Automation scripts'],
    build: 'A personal automation toolkit',
    roles: ['Python Developer', 'Automation Engineer', 'Junior Backend Developer'],
    prereq: 'None. Beginners are welcome',
  },
  'AI and Machine Learning': {
    badge: 'Hot',
    modules: ['Python for data science', 'Statistics and feature engineering', 'Supervised and unsupervised models', 'Evaluation and tuning', 'Serving a model as an API'],
    build: 'A spam message classifier',
    roles: ['Junior ML Engineer', 'Junior Data Scientist', 'AI Developer'],
    prereq: 'Python and basic maths',
  },
  'Data Analytics': {
    badge: 'In demand',
    modules: ['Excel for analysis', 'SQL queries and joins', 'Data cleaning and exploration', 'Power BI dashboards', 'Storytelling with data'],
    build: 'A sales insights dashboard',
    roles: ['Data Analyst', 'BI Analyst', 'Reporting Analyst'],
    prereq: 'None. Beginners are welcome',
  },
  'Cloud and DevOps': {
    badge: 'Rising',
    modules: ['Linux and networking basics', 'Docker containers', 'CI/CD pipelines', 'Azure or AWS core services', 'Monitoring and cost basics'],
    build: 'A containerised app with an automated pipeline',
    roles: ['Cloud Engineer', 'DevOps Engineer', 'Support Engineer'],
    prereq: 'Basic programming or IT knowledge',
  },
  'Software Testing': {
    badge: 'Quick start',
    modules: ['Testing fundamentals and test cases', 'Bug reports with Jira', 'Selenium automation', 'API testing with Postman', 'Test reports'],
    build: 'An automated regression test suite',
    roles: ['QA Engineer', 'Automation Tester', 'Junior SDET'],
    prereq: 'None. Beginners are welcome',
  },
};
