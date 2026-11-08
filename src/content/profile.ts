/**
 * About, experience, education and skills.
 * Only confirmed information belongs here. No GPA, metrics or invented roles.
 */

export const about = {
  lead: "I'm a Computer Engineering student at the Lebanese American University, interested in building software that solves practical problems.",
  body: [
    'Working in restaurant operations has given me a first-hand view of operational challenges, inefficiencies and the everyday workflows a business depends on. That perspective shapes how I approach software.',
    'I enjoy identifying problems, understanding their underlying requirements and developing practical technical solutions for them.',
    "Beyond business applications, I'm interested in software engineering, relational database systems, automation and software integrations, and especially in product-oriented engineering, where technical decisions are guided by actual user needs.",
  ],
  interests: [
    'Software Engineering',
    'Product Development',
    'Database Systems',
    'Automation',
    'Practical Software Solutions',
  ],
}

/** "Currently" block in the hero: factual, present-tense facts only. */
export const currently = [
  { title: 'Studying Computer Engineering', detail: 'Lebanese American University, Byblos' },
  { title: 'Operations Assistant', detail: 'Restaurant Al Fawar' },
  { title: 'Building FawarOS & IDLab', detail: 'Business software · Automation' },
]

export interface ExperienceItem {
  role: string
  organization: string
  period: string
  points: string[]
}

export const experience: ExperienceItem[] = [
  {
    role: 'Operations Assistant',
    organization: 'Restaurant Al Fawar',
    period: '2025 – Present',
    points: [
      'Supporting daily restaurant operations',
      'Reviewing orders and POS records',
      'Identifying and resolving operational inconsistencies',
      'Understanding business processes and workflow inefficiencies',
      'Applying operational experience to software product ideas',
    ],
  },
]

export const education = {
  institution: 'Lebanese American University',
  campus: 'Byblos',
  degree: 'Bachelor of Engineering in Computer Engineering',
  period: 'Expected Graduation 2029',
}

export interface SkillGroup {
  title: string
  items: string[]
}

export const skills: SkillGroup[] = [
  { title: 'Programming Languages', items: ['Java', 'C++', 'SQL'] },
  {
    title: 'Computer Science & Engineering',
    items: ['Object-Oriented Programming', 'Data Structures & Algorithms', 'Relational Database Design'],
  },
  { title: 'Database Technologies', items: ['MySQL'] },
  { title: 'Development Tools', items: ['Git & GitHub', 'Postman', 'VS Code'] },
]
