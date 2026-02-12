export type SocialLinks = {
  linkedin?: string;
  github?: string;
  tableau?: string;
  powerbi?: string;
};

export type Profile = {
  name: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  accentColor?: string;
  links: SocialLinks;
};

export type Project = {
  id: string;
  title: string;
  description?: string;
  link?: string;
  images: string[];
};

export type Experience = {
  id: string;
  title: string;
  position?: string;
  description?: string;
  date?: string;
};

// New types for the desired home page
export type HeroSection = {
  subtitle: string;
  title: string;
  description: string;
};

export type AboutSection = {
  title: string;
  p1_start: string;
  p1_highlight: string;
  p1_end: string;
  p2: string;
  tags: string[];
};

export type EducationItem = {
  id: string;
  degree: string;
  school: string;
  date: string;
  desc: string;
};

export type TimelineExperience = {
  title: string;
  date: string;
  company: string;
  points: string[];
};

export type SkillsSection = {
  technical: Record<string, string[]>;
  soft: { title: string; desc: string }[];
};

export type ServiceItem = {
  title: string;
  desc: string;
  icon: string;
};

export type ContactSection = {
  phone?: string;
  linkedin?: string;
};

export type Portfolio = {
  // existing
  profile: Profile;
  projects: Project[];
  experiences: Experience[];

  // new (optional for backward compatibility)
  hero?: HeroSection;
  about?: AboutSection;
  education?: EducationItem[];
  timelineExperience?: TimelineExperience;
  skills?: SkillsSection;
  services?: ServiceItem[];
  contact?: ContactSection;
};
