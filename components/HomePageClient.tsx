"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Portfolio,
  HeroSection,
  AboutSection,
  EducationItem,
  TimelineExperience,
  SkillsSection,
  ServiceItem,
  ContactSection,
  CourseItem,
} from "@/lib/types";

type Theme = {
  bg: string;
  bgAlt: string;
  text: string;
  textMuted: string;
  textHeading: string;
  border: string;
  cardHover: string;
  navBg: string;
  navText: string;
  inputBg: string;
  heroGradient: string;
};

function getTheme(isDarkMode: boolean): Theme {
  return {
    bg: isDarkMode ? "bg-neutral-950" : "bg-gray-50",
    bgAlt: isDarkMode ? "bg-neutral-900" : "bg-white",
    text: isDarkMode ? "text-neutral-200" : "text-neutral-800",
    textMuted: isDarkMode ? "text-neutral-400" : "text-neutral-600",
    textHeading: isDarkMode ? "text-white" : "text-neutral-900",
    border: isDarkMode ? "border-neutral-800" : "border-gray-200",
    cardHover: isDarkMode
      ? "hover:border-emerald-500/30"
      : "hover:border-emerald-500/50 hover:shadow-lg",
    navBg: isDarkMode ? "bg-neutral-950/80" : "bg-white/80",
    navText: isDarkMode
      ? "text-neutral-400 hover:text-white"
      : "text-neutral-600 hover:text-emerald-600",
    inputBg: isDarkMode ? "bg-neutral-950" : "bg-white",
    heroGradient: isDarkMode
      ? "from-neutral-900 via-neutral-950 to-neutral-950"
      : "from-gray-100 via-gray-50 to-gray-50",
  };
}

function Icon({ name, className }: { name: string; className?: string }) {
  // Minimal inline icons (avoid adding deps). Only the ones used in services.
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;
  switch (name) {
    case "Database":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      );
    case "Terminal":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 17V7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2z" />
          <path d="M7 9l3 3-3 3" />
          <path d="M11 15h6" />
        </svg>
      );
    case "BarChart":
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 20V4" />
          <path d="M4 20h16" />
          <path d="M8 20v-8" />
          <path d="M12 20v-12" />
          <path d="M16 20v-5" />
        </svg>
      );
  }
}

export default function HomePageClient({ initial }: { initial: Portfolio }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  // Accent color (emerald) is mostly hard-coded via classes; keep CSS var in sync for buttons/etc.
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", "#10b981");
    document.documentElement.style.setProperty("--accent-hover", "#059669");
  }, []);

  const hero: HeroSection =
    initial.hero ??
    ({
      subtitle: "Data Analyst Portfolio",
      title: initial.profile?.name?.toUpperCase?.() || "PORTFOLIO",
      description: "",
    } as HeroSection);

  const about: AboutSection | undefined = initial.about;
  const education: EducationItem[] = initial.education ?? [];
  const timelineExperience: TimelineExperience | undefined = initial.timelineExperience;
  const skills: SkillsSection | undefined = initial.skills;
  const services: ServiceItem[] = initial.services ?? [];
  const contact: ContactSection | undefined = initial.contact;
  const courses: CourseItem[] = initial.courses ?? [];

  const navItems = [
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "courses", label: "Courses" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact" },
  ];

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text}`}
    >
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${theme.navBg} ${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              <span
                className={`text-xl font-bold tracking-tighter ${theme.textHeading}`}
              >
                {"M.SAMY"}
                <span className="text-emerald-500">.</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors duration-300 text-sm font-medium tracking-wide uppercase hover:border-b hover:border-emerald-500 ${theme.navText}`}
                >
                  {item.label}
                </button>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode((v) => !v)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? "hover:bg-neutral-800 text-yellow-400"
                    : "hover:bg-gray-100 text-neutral-600"
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? "☀" : "☾"}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode((v) => !v)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? "text-yellow-400" : "text-neutral-600"
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? "☀" : "☾"}
              </button>
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                className={`${theme.textMuted} p-2`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? "✕" : "≡"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className={`md:hidden border-b ${theme.border} ${theme.bgAlt}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-4 text-base font-medium ${theme.navText}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative pt-16"
      >
        <div
          className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${theme.heroGradient} opacity-50`}
        ></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 w-full">
          <div className="mb-4">
            <span className="text-emerald-500 font-medium tracking-widest uppercase text-sm animate-pulse block">
              {hero.subtitle}
            </span>
          </div>
          <div className="mb-6">
            <h1
              className={`text-5xl md:text-7xl font-bold tracking-tight block w-full text-center ${theme.textHeading}`}
            >
              {hero.title}
            </h1>
          </div>
          <div className="mb-10 max-w-2xl mx-auto">
            <p className={`text-xl md:text-2xl font-light ${theme.textMuted}`}>
              {hero.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection("contact")}
              className={`px-8 py-3 font-semibold rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              Contact Me
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className={`px-8 py-3 bg-transparent border font-semibold rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "border-neutral-700 text-white hover:bg-neutral-900 hover:border-neutral-500"
                  : "border-neutral-300 text-neutral-900 hover:bg-gray-100 hover:border-emerald-500"
              }`}
            >
              View Experience
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      {about && (
        <section id="about" className={`py-20 ${theme.bgAlt}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className={`text-3xl font-bold mb-6 flex items-center ${theme.textHeading}`}
                >
                  <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
                  {about.title}
                </h2>

                <div className={`${theme.textMuted} leading-relaxed mb-6 text-lg`}>
                  {about.p1_start} {" "}
                  <span className="text-emerald-500 font-medium">
                    {about.p1_highlight}
                  </span>{" "}
                  {about.p1_end}
                </div>

                <div className={`${theme.textMuted} leading-relaxed mb-6`}>
                  {about.p2}
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  {(about.tags ?? []).map((tag, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded text-sm text-emerald-500 border ${
                        isDarkMode
                          ? "bg-neutral-800 border-neutral-700"
                          : "bg-white border-emerald-500/30"
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div
                  className={`aspect-square rounded-2xl border p-8 relative overflow-hidden group transition-all ${
                    isDarkMode
                      ? "bg-neutral-800 border-neutral-700"
                      : "bg-white border-gray-200 shadow-xl"
                  } ${theme.cardHover}`}
                >
                  <div className="w-16 h-16 text-emerald-500 mb-4 opacity-50">
                    <Icon name="Terminal" className="w-16 h-16" />
                  </div>
                  <div
                    className={`space-y-3 font-mono text-sm ${
                      isDarkMode ? "text-neutral-500" : "text-neutral-600"
                    }`}
                  >
                    <p>&gt; import pandas as pd</p>
                    <p>&gt; import matplotlib.pyplot as plt</p>
                    <p>&gt; df = pd.read_csv('insights.csv')</p>
                    <p>&gt; df.analyze()</p>
                    <p className="text-emerald-500 animate-pulse">_</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      <section id="education" className={`py-20 ${theme.bg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold flex items-center mb-12 ${theme.textHeading}`}>
            <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
            EDUCATION
          </h2>

          <div className="space-y-8">
            {education.length === 0 ? (
              <div className={`rounded-xl border p-6 ${theme.bgAlt} ${theme.border} ${theme.textMuted}`}>
                No education items yet.
              </div>
            ) : (
              education.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-xl border transition-all duration-300 ${theme.bgAlt} ${theme.border} ${theme.cardHover}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${theme.textHeading}`}>
                      {item.degree}
                    </h3>
                    <span className={`${theme.textMuted} text-sm mt-2 md:mt-0 whitespace-nowrap md:ml-4`}>
                      {item.date}
                    </span>
                  </div>
                  <p className="text-emerald-500 mb-2 font-medium">{item.school}</p>
                  <p className={theme.textMuted}>{item.desc}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className={`py-20 ${theme.bgAlt}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold flex items-center mb-12 ${theme.textHeading}`}>
            <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
            COURSES
          </h2>

          <div className="space-y-6">
            {courses.length === 0 ? (
              <div className={`rounded-xl border p-6 ${theme.bg} ${theme.border} ${theme.textMuted}`}>
                No courses added yet.
              </div>
            ) : (
              courses.map((c) => (
                <div
                  key={c.id}
                  className={`p-6 rounded-xl border transition-all duration-300 ${theme.bg} ${theme.border} ${theme.cardHover}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h3 className={`text-xl font-bold ${theme.textHeading}`}>{c.title}</h3>
                    {(c.date || c.platform) && (
                      <span className={`${theme.textMuted} text-sm whitespace-nowrap`}>
                        {[c.platform, c.date].filter(Boolean).join(" • ")}
                      </span>
                    )}
                  </div>
                  {c.desc && <p className={theme.textMuted}>{c.desc}</p>}
                  {c.link && (
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center font-medium hover:text-emerald-500 mt-4 ${
                        isDarkMode ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      View Certificate <span className="ml-2">↗</span>
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Experience (timeline single) */}
      {timelineExperience && (
        <section id="experience" className={`py-20 ${theme.bgAlt}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold mb-12 flex items-center ${theme.textHeading}`}>
              <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
              EXPERIENCE
            </h2>

            <div
              className={`relative border-l-2 ml-4 md:ml-6 space-y-12 ${
                isDarkMode ? "border-neutral-800" : "border-gray-200"
              }`}
            >
              <div className="relative pl-8 md:pl-12">
                <div
                  className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 ${
                    isDarkMode ? "border-neutral-900" : "border-white"
                  }`}
                ></div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                  <h3 className={`text-2xl font-bold ${theme.textHeading}`}>
                    {timelineExperience.title}
                  </h3>
                  <span className="text-emerald-500 font-medium">
                    {timelineExperience.date}
                  </span>
                </div>

                <p className={`${theme.textMuted} mb-6 font-medium`}>
                  {timelineExperience.company}
                </p>

                <ul className={`space-y-4 ${theme.textMuted}`}>
                  {(timelineExperience.points ?? []).map((p, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-emerald-500 mr-2 mt-1 flex-shrink-0">▹</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects (uses existing DB projects list) */}
      <section id="projects" className={`py-20 ${theme.bg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold flex items-center mb-12 ${theme.textHeading}`}>
            <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
            PROJECTS
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(initial.projects ?? []).map((project) => (
              <div
                key={project.id}
                className={`rounded-xl border p-6 transition-all group relative flex flex-col ${theme.bgAlt} ${theme.border} ${theme.cardHover}`}
              >
                <h3 className={`text-xl font-bold mb-2 ${theme.textHeading}`}>
                  {project.title}
                </h3>
                <p className={`text-sm ${theme.textMuted} mb-6 flex-grow`}>
                  {project.description || ""}
                </p>

                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center font-medium hover:text-emerald-500 mt-auto ${
                      isDarkMode ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    View Project <span className="ml-2">↗</span>
                  </a>
                ) : (
                  <span className={`text-sm ${theme.textMuted} mt-auto`}>No link</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      {skills && (
        <section id="skills" className={`py-20 ${theme.bgAlt}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold mb-12 flex items-center ${theme.textHeading}`}>
              <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
              SKILLS
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Technical */}
              <div className={`p-8 rounded-xl border ${theme.bg} ${theme.border}`}>
                <div className="flex items-center mb-6">
                  <div className="text-emerald-500 mr-3 w-6 h-6">
                    <Icon name="BarChart" className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme.textHeading}`}>
                    Technical Skills
                  </h3>
                </div>
                <div className="space-y-6">
                  {Object.entries(skills.technical ?? {}).map(([key, list]) => (
                    <div key={key}>
                      <h4 className={`${theme.textMuted} text-sm mb-2 uppercase tracking-wide capitalize`}>
                        {key}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {list.map((s, idx) => (
                          <span
                            key={idx}
                            className={`block px-3 py-1 rounded text-sm border ${
                              isDarkMode
                                ? "bg-neutral-800 text-neutral-200 border-neutral-700"
                                : "bg-white text-neutral-700 border-gray-200 shadow-sm"
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft */}
              <div className={`p-8 rounded-xl border ${theme.bg} ${theme.border}`}>
                <div className="flex items-center mb-6">
                  <div className="text-emerald-500 mr-3 w-6 h-6">
                    <Icon name="Database" className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme.textHeading}`}>
                    Soft Skills
                  </h3>
                </div>
                <ul className="space-y-4">
                  {(skills.soft ?? []).map((skill, index) => (
                    <li
                      key={index}
                      className={`p-4 rounded border ${theme.bgAlt} ${theme.border}`}
                    >
                      <h4 className={`font-medium ${theme.textHeading}`}>
                        {skill.title}
                      </h4>
                      <p className={`text-sm mt-1 ${theme.textMuted}`}>
                        {skill.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section id="services" className={`py-20 ${theme.bg}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold mb-12 flex items-center ${theme.textHeading}`}>
              <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
              SERVICES
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border transition-colors group ${theme.bgAlt} ${theme.border} ${theme.cardHover}`}
                >
                  <div className={`mb-4 transition-colors ${theme.textMuted} group-hover:text-emerald-500`}>
                    <Icon name={service.icon} className="h-10 w-10" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${theme.textHeading}`}>
                    {service.title}
                  </h3>
                  <p className={theme.textMuted}>{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className={`py-24 relative overflow-hidden ${theme.bgAlt}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className={`text-3xl font-bold mb-8 ${theme.textHeading}`}>
            Ready to analyze your data?
          </h2>
          <p className={`text-xl mb-12 ${theme.textMuted}`}>
            I am available for freelance projects and internships. Let's discuss how data can help your business grow.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div
              className={`flex items-center justify-center p-6 border rounded-xl transition-all group ${theme.bg} ${theme.border} ${theme.cardHover}`}
            >
              <div className="mr-3 text-emerald-500">☎</div>
              <div className="text-left w-full">
                <span className={`block text-xs uppercase tracking-wider ${theme.textMuted}`}>
                  Phone & WhatsApp
                </span>
                <span className={`font-medium block ${theme.textHeading}`}>
                  {contact?.phone || initial.profile.phone || ""}
                </span>
              </div>
            </div>

            <div
              className={`flex items-center justify-center p-6 border rounded-xl transition-all group ${theme.bg} ${theme.border} ${theme.cardHover}`}
            >
              <div className="mr-3 text-emerald-500">in</div>
              <div className="text-left w-full overflow-hidden">
                <span className={`block text-xs uppercase tracking-wider ${theme.textMuted}`}>
                  LinkedIn
                </span>
                {contact?.linkedin || initial.profile.links?.linkedin ? (
                  <a
                    href={contact?.linkedin || initial.profile.links?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium hover:text-emerald-500 truncate block ${theme.textHeading}`}
                  >
                    Visit Profile
                  </a>
                ) : (
                  <span className={`${theme.textMuted} text-sm`}>Not set</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={`py-8 border-t text-center relative ${theme.bg} ${theme.border}`}>
        <p className={`text-sm ${theme.textMuted}`}>
          © {new Date().getFullYear()} {initial.profile?.name || "Portfolio"}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

