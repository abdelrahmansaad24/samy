import { getDb } from "./db";
import {
  Profile,
  Project,
  Experience,
  Portfolio,
  HeroSection,
  AboutSection,
  EducationItem,
  TimelineExperience,
  SkillsSection,
  ServiceItem,
  ContactSection,
  CourseItem,
} from "./types";

// Define the document type for our portfolio collection
interface PortfolioDoc {
  _id: string;
  profile?: Profile;
  projects?: Project[];
  experiences?: Experience[];

  hero?: HeroSection;
  about?: AboutSection;
  education?: EducationItem[];
  timelineExperience?: TimelineExperience;
  skills?: SkillsSection;
  services?: ServiceItem[];
  contact?: ContactSection;
  courses?: CourseItem[];
}

const DEFAULT_PROFILE: Profile = {
  name: "Mohamed Samy",
  title: "Data Analyst",
  bio: "",
  email: "",
  phone: "",
  avatarUrl: "",
  accentColor: "#3b82f6",
  links: {},
};

const DEFAULT_HERO: HeroSection = {
  subtitle: "Data Analyst Portfolio",
  title: "MOHAMED SAMY",
  description:
    "Transforming raw data into actionable insights through Python, SQL, and Visualization.",
};

const DEFAULT_ABOUT: AboutSection = {
  title: "ABOUT ME",
  p1_start: "I am an",
  p1_highlight: "Intern Data Analyst",
  p1_end:
    "with a strong foundation in data analysis and visualization. I specialize in turning complex datasets into clear narratives.",
  p2:
    "Skilled in Python, SQL, Excel, Power BI, and Tableau, with hands-on experience in data cleaning, exploratory data analysis (EDA), and dashboard creation.",
  tags: ["Motivated", "Fast Learner", "Problem Solver"],
};

const DEFAULT_EDUCATION: EducationItem[] = [];

const DEFAULT_TIMELINE_EXPERIENCE: TimelineExperience = {
  title: "Freelance Data Analyst",
  date: "Jan 2020 – Present",
  company: "Self-Employed / Remote",
  points: [],
};

const DEFAULT_SKILLS: SkillsSection = {
  technical: {
    analysis: ["Data Cleaning", "EDA", "Web Scraping", "Pattern Recognition"],
    programming: ["Python (Pandas, NumPy)", "SQL"],
    viz: ["Power BI", "Tableau", "Advanced Excel", "MS Office"],
  },
  soft: [],
};

const DEFAULT_SERVICES: ServiceItem[] = [];

const DEFAULT_CONTACT: ContactSection = {
  phone: "",
  linkedin: "",
};

const DEFAULT_COURSES: CourseItem[] = [];

export async function getPortfolio(): Promise<Portfolio> {
  const db = await getDb();
  const col = db.collection<PortfolioDoc>("portfolio");
  const doc = await col.findOne({ _id: "main" });
  if (!doc) {
    return {
      profile: DEFAULT_PROFILE,
      projects: [],
      experiences: [],
      hero: DEFAULT_HERO,
      about: DEFAULT_ABOUT,
      education: DEFAULT_EDUCATION,
      timelineExperience: DEFAULT_TIMELINE_EXPERIENCE,
      skills: DEFAULT_SKILLS,
      services: DEFAULT_SERVICES,
      contact: DEFAULT_CONTACT,
      courses: DEFAULT_COURSES,
    };
  }
  return {
    profile: doc.profile ?? DEFAULT_PROFILE,
    projects: doc.projects ?? [],
    experiences: doc.experiences ?? [],

    hero: doc.hero ?? DEFAULT_HERO,
    about: doc.about ?? DEFAULT_ABOUT,
    education: doc.education ?? DEFAULT_EDUCATION,
    timelineExperience: doc.timelineExperience ?? DEFAULT_TIMELINE_EXPERIENCE,
    skills: doc.skills ?? DEFAULT_SKILLS,
    services: doc.services ?? DEFAULT_SERVICES,
    contact: doc.contact ?? DEFAULT_CONTACT,
    courses: doc.courses ?? DEFAULT_COURSES,
  };
}

export async function updateProfile(profile: Profile): Promise<void> {
  const db = await getDb();
  const col = db.collection<PortfolioDoc>("portfolio");
  await col.updateOne(
    { _id: "main" },
    { $set: { profile } },
    { upsert: true }
  );
}

export async function updateProjects(projects: Project[]): Promise<void> {
  const db = await getDb();
  const col = db.collection<PortfolioDoc>("portfolio");
  await col.updateOne(
    { _id: "main" },
    { $set: { projects } },
    { upsert: true }
  );
}

export async function updateExperiences(experiences: Experience[]): Promise<void> {
  const db = await getDb();
  const col = db.collection<PortfolioDoc>("portfolio");
  await col.updateOne(
    { _id: "main" },
    { $set: { experiences } },
    { upsert: true }
  );
}
