"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
} from "@/lib/types";

const VALID_USERNAME = process.env.NEXT_PUBLIC_USERNAME;
const VALID_PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState<Profile>({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    avatarUrl: "",
    accentColor: "#3b82f6",
    links: {},
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [hero, setHero] = useState<HeroSection>({
    subtitle: "",
    title: "",
    description: "",
  });
  const [about, setAbout] = useState<AboutSection>({
    title: "",
    p1_start: "",
    p1_highlight: "",
    p1_end: "",
    p2: "",
    tags: [],
  });
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [timelineExperience, setTimelineExperience] = useState<TimelineExperience>({
    title: "",
    date: "",
    company: "",
    points: [],
  });
  const [skills, setSkills] = useState<SkillsSection>({
    technical: { analysis: [], programming: [], viz: [] },
    soft: [],
  });
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [contact, setContact] = useState<ContactSection>({ phone: "", linkedin: "" });

  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "projects"
    | "experiences"
    | "homepage"
    | "education"
    | "skills"
    | "services"
    | "contact"
  >("profile");

  const [tempAvatarFile, setTempAvatarFile] = useState<File | null>(null);
  const [projectTempImages, setProjectTempImages] = useState<Record<string, { url: string; file?: File; isExisting: boolean }[]>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchPortfolio();
    }
  }, [isLoggedIn]);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data: Portfolio = await res.json();
      setProfile(data.profile);
      setProjects(data.projects);
      setExperiences(data.experiences);

      if (data.hero) setHero(data.hero);
      if (data.about) setAbout(data.about);
      if (data.education) setEducation(data.education);
      if (data.timelineExperience) setTimelineExperience(data.timelineExperience);
      if (data.skills) setSkills(data.skills);
      if (data.services) setServices(data.services);
      if (data.contact) setContact(data.contact);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      // Handle avatar upload
      if (tempAvatarFile) {
        const oldUrl = profile.avatarUrl;
        const url = await uploadImage(tempAvatarFile);
        if (url) {
          setProfile({ ...profile, avatarUrl: url });
          setTempAvatarFile(null);
          // Delete old avatar if it was uploaded and not blob
          if (oldUrl && !oldUrl.startsWith('blob:') && oldUrl !== url) {
            await deleteImage(oldUrl);
          }
        }
      }
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      showMessage("Profile saved successfully!");
    } catch (_err) {
      showMessage("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const saveProjects = async () => {
    setSaving(true);
    try {
      const newProjects = await Promise.all(projects.map(async (project) => {
        const tempImages = projectTempImages[project.id] || [];
        const newImages = await Promise.all(
          tempImages.map(async (img) => {
            if (img.file) {
              const url = await uploadImage(img.file);
              return url || img.url;
            }
            return img.url;
          })
        );
        return { ...project, images: newImages };
      }));
      setProjects(newProjects);
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProjects),
      });
      showMessage("Projects saved successfully!");
    } catch (_err) {
      showMessage("Failed to save projects");
    } finally {
      setSaving(false);
    }
  };

  const saveExperiences = async () => {
    setSaving(true);
    try {
      await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experiences),
      });
      showMessage("Experiences saved successfully!");
    } catch (err) {
      showMessage("Failed to save experiences");
    } finally {
      setSaving(false);
    }
  };

  // Save new sections
  const saveHomePage = async () => {
    setSaving(true);
    try {
      await fetch("/api/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero, about, timelineExperience }),
      });
      showMessage("Home page sections saved successfully!");
    } catch {
      showMessage("Failed to save home page sections");
    } finally {
      setSaving(false);
    }
  };

  const saveEducation = async () => {
    setSaving(true);
    try {
      await fetch("/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(education),
      });
      showMessage("Education saved successfully!");
    } catch {
      showMessage("Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const saveSkills = async () => {
    setSaving(true);
    try {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skills),
      });
      showMessage("Skills saved successfully!");
    } catch {
      showMessage("Failed to save skills");
    } finally {
      setSaving(false);
    }
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      });
      showMessage("Services saved successfully!");
    } catch {
      showMessage("Failed to save services");
    } finally {
      setSaving(false);
    }
  };

  const saveContact = async () => {
    setSaving(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      showMessage("Contact saved successfully!");
    } catch {
      showMessage("Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const deleteImage = async (url: string) => {
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        title: "New Project",
        description: "",
        link: "",
        images: [],
      },
    ]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(projects => projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        title: "New Experience",
        position: "",
        description: "",
        date: "",
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter password"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 text-green-400 text-center">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "btn-primary" : "btn-secondary"}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={activeTab === "projects" ? "btn-primary" : "btn-secondary"}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("experiences")}
            className={activeTab === "experiences" ? "btn-primary" : "btn-secondary"}
          >
            Experiences
          </button>
          <button
            onClick={() => setActiveTab("homepage")}
            className={activeTab === "homepage" ? "btn-primary" : "btn-secondary"}
          >
            Home Page
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={activeTab === "education" ? "btn-primary" : "btn-secondary"}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={activeTab === "skills" ? "btn-primary" : "btn-secondary"}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={activeTab === "services" ? "btn-primary" : "btn-secondary"}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={activeTab === "contact" ? "btn-primary" : "btn-secondary"}
          >
            Contact
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="card space-y-6">
            <h2 className="text-xl font-semibold">Edit Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Data Analyst"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Bio</label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input-field min-h-[100px]"
                placeholder="Write about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="input-field"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Avatar</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={profile.avatarUrl || ""}
                  onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  className="input-field flex-1"
                  placeholder="Image URL or upload below"
                />
                <label className="btn-secondary cursor-pointer">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setTempAvatarFile(file);
                        setProfile({ ...profile, avatarUrl: URL.createObjectURL(file) });
                      }
                    }}
                  />
                </label>
              </div>
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar preview"
                  className="mt-2 w-24 h-24 object-cover rounded-full"
                />
              )}
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t border-[var(--card-border)]">
              Social Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={profile.links.linkedin || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, linkedin: e.target.value } })
                  }
                  className="input-field"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">GitHub</label>
                <input
                  type="url"
                  value={profile.links.github || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, github: e.target.value } })
                  }
                  className="input-field"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Tableau</label>
                <input
                  type="url"
                  value={profile.links.tableau || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, tableau: e.target.value } })
                  }
                  className="input-field"
                  placeholder="https://public.tableau.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Power BI</label>
                <input
                  type="url"
                  value={profile.links.powerbi || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, powerbi: e.target.value } })
                  }
                  className="input-field"
                  placeholder="https://app.powerbi.com/..."
                />
              </div>
            </div>

            <button onClick={saveProfile} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Projects</h2>
              <button onClick={addProject} className="btn-primary">
                + Add Project
              </button>
            </div>

            {projects.map((project) => (
              <ProjectEditor
                key={project.id}
                project={project}
                onUpdate={(updates) => updateProject(project.id, updates)}
                onRemove={() => removeProject(project.id)}
                onDeleteImage={deleteImage}
                setProjectTempImages={setProjectTempImages}
              />
            ))}

            {projects.length > 0 && (
              <button onClick={saveProjects} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save All Projects"}
              </button>
            )}
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === "experiences" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Experiences</h2>
              <button onClick={addExperience} className="btn-primary">
                + Add Experience
              </button>
            </div>

            {experiences.map((exp) => (
              <div key={exp.id} className="card space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Experience</h3>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--muted)] mb-1">Title / Company</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                      className="input-field"
                      placeholder="Company or role title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--muted)] mb-1">Position</label>
                    <input
                      type="text"
                      value={exp.position || ""}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Data Analyst"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Date</label>
                  <input
                    type="text"
                    value={exp.date || ""}
                    onChange={(e) => updateExperience(exp.id, { date: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Jan 2023 - Present"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Description</label>
                  <textarea
                    value={exp.description || ""}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    className="input-field min-h-[80px]"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}

            {experiences.length > 0 && (
              <button onClick={saveExperiences} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save All Experiences"}
              </button>
            )}
          </div>
        )}

        {/* Home Page Tab */}
        {activeTab === "homepage" && (
          <div className="card space-y-6">
            <h2 className="text-xl font-semibold">Edit Home Page Sections</h2>

            {/* Hero Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Title</label>
                  <input
                    type="text"
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    className="input-field"
                    placeholder="Hero title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={hero.subtitle}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    className="input-field"
                    placeholder="Hero subtitle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Description</label>
                <textarea
                  value={hero.description}
                  onChange={(e) => setHero({ ...hero, description: e.target.value })}
                  className="input-field min-h-[80px]"
                  placeholder="Hero section description"
                />
              </div>
            </div>

            {/* About Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">About Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Title</label>
                  <input
                    type="text"
                    value={about.title}
                    onChange={(e) => setAbout({ ...about, title: e.target.value })}
                    className="input-field"
                    placeholder="About section title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={about.tags.join(", ")}
                    onChange={(e) => setAbout({ ...about, tags: e.target.value.split(",").map(tag => tag.trim()) })}
                    className="input-field"
                    placeholder="e.g. Developer, Designer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Paragraph 1 (start)</label>
                <textarea
                  value={about.p1_start}
                  onChange={(e) => setAbout({ ...about, p1_start: e.target.value })}
                  className="input-field min-h-[80px]"
                  placeholder="First part of the about section"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Paragraph 1 (highlight)</label>
                <textarea
                  value={about.p1_highlight}
                  onChange={(e) => setAbout({ ...about, p1_highlight: e.target.value })}
                  className="input-field min-h-[80px]"
                  placeholder="Highlighted part of the about section"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Paragraph 1 (end)</label>
                <textarea
                  value={about.p1_end}
                  onChange={(e) => setAbout({ ...about, p1_end: e.target.value })}
                  className="input-field min-h-[80px]"
                  placeholder="Last part of the about section"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Paragraph 2</label>
                <textarea
                  value={about.p2}
                  onChange={(e) => setAbout({ ...about, p2: e.target.value })}
                  className="input-field min-h-[80px]"
                  placeholder="Additional information"
                />
              </div>
            </div>

            {/* Timeline Experience Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Timeline Experience Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Title</label>
                  <input
                    type="text"
                    value={timelineExperience.title}
                    onChange={(e) => setTimelineExperience({ ...timelineExperience, title: e.target.value })}
                    className="input-field"
                    placeholder="Timeline title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Date</label>
                  <input
                    type="text"
                    value={timelineExperience.date}
                    onChange={(e) => setTimelineExperience({ ...timelineExperience, date: e.target.value })}
                    className="input-field"
                    placeholder="e.g. 2023"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Company</label>
                <input
                  type="text"
                  value={timelineExperience.company}
                  onChange={(e) => setTimelineExperience({ ...timelineExperience, company: e.target.value })}
                  className="input-field"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Points (comma separated)</label>
                <input
                  type="text"
                  value={timelineExperience.points.join(", ")}
                  onChange={(e) => setTimelineExperience({ ...timelineExperience, points: e.target.value.split(",").map(point => point.trim()) })}
                  className="input-field"
                  placeholder="e.g. Developed a new feature, Improved performance"
                />
              </div>
            </div>

            <button onClick={saveHomePage} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Home Page Sections"}
            </button>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Education</h2>
              <button
                onClick={() =>
                  setEducation([
                    ...education,
                    {
                      id: Date.now().toString(),
                      degree: "New Degree",
                      school: "School / Platform",
                      date: "",
                      desc: "",
                    },
                  ])
                }
                className="btn-primary"
              >
                + Add Education
              </button>
            </div>

            {education.map((edu, idx) => (
              <div key={edu.id} className="card space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Education {idx + 1}</h3>
                  <button
                    onClick={() => setEducation(education.filter((e) => e.id !== edu.id))}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--muted)] mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        setEducation(
                          education.map((it) =>
                            it.id === edu.id ? { ...it, degree: e.target.value } : it
                          )
                        )
                      }
                      className="input-field"
                      placeholder="e.g. Google Data Analytics Certificate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--muted)] mb-1">School</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) =>
                        setEducation(
                          education.map((it) =>
                            it.id === edu.id ? { ...it, school: e.target.value } : it
                          )
                        )
                      }
                      className="input-field"
                      placeholder="e.g. Coursera (Google)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Date</label>
                  <input
                    type="text"
                    value={edu.date}
                    onChange={(e) =>
                      setEducation(
                        education.map((it) =>
                          it.id === edu.id ? { ...it, date: e.target.value } : it
                        )
                      )
                    }
                    className="input-field"
                    placeholder="e.g. Nov 2024 : May 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Description</label>
                  <textarea
                    value={edu.desc}
                    onChange={(e) =>
                      setEducation(
                        education.map((it) =>
                          it.id === edu.id ? { ...it, desc: e.target.value } : it
                        )
                      )
                    }
                    className="input-field min-h-[80px]"
                    placeholder="What you learned / focus areas"
                  />
                </div>
              </div>
            ))}

            {education.length > 0 && (
              <button onClick={saveEducation} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Education"}
              </button>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="card space-y-6">
            <h2 className="text-xl font-semibold">Edit Skills</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Analysis Skills (comma separated)</label>
                <textarea
                  value={(skills.technical.analysis ?? []).join(", ")}
                  onChange={(e) =>
                    setSkills({
                      ...skills,
                      technical: {
                        ...skills.technical,
                        analysis: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="input-field min-h-[100px]"
                  placeholder="Data Cleaning, EDA, ..."
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Programming Skills (comma separated)</label>
                <textarea
                  value={(skills.technical.programming ?? []).join(", ")}
                  onChange={(e) =>
                    setSkills({
                      ...skills,
                      technical: {
                        ...skills.technical,
                        programming: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="input-field min-h-[100px]"
                  placeholder="Python, SQL, ..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Visualization Skills (comma separated)</label>
                <textarea
                  value={(skills.technical.viz ?? []).join(", ")}
                  onChange={(e) =>
                    setSkills({
                      ...skills,
                      technical: {
                        ...skills.technical,
                        viz: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="input-field min-h-[100px]"
                  placeholder="Power BI, Tableau, Excel, ..."
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Soft skills (one per line: title | desc)</label>
                <textarea
                  value={(skills.soft ?? [])
                    .map((s) => `${s.title} | ${s.desc}`)
                    .join("\n")}
                  onChange={(e) => {
                    const parsed = e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [title, ...rest] = line.split("|");
                        return {
                          title: (title ?? "").trim(),
                          desc: rest.join("|").trim(),
                        };
                      })
                      .filter((x) => x.title.length > 0);
                    setSkills({ ...skills, soft: parsed });
                  }}
                  className="input-field min-h-[100px]"
                  placeholder="Communication | Presenting insights to stakeholders"
                />
              </div>
            </div>

            <button onClick={saveSkills} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Skills"}
            </button>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Services</h2>
              <button
                onClick={() =>
                  setServices([
                    ...services,
                    { title: "New Service", desc: "", icon: "BarChart" },
                  ])
                }
                className="btn-primary"
              >
                + Add Service
              </button>
            </div>

            {services.map((service, idx) => (
              <div key={`${service.title}-${idx}`} className="card space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Service {idx + 1}</h3>
                  <button
                    onClick={() => setServices(services.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--muted)] mb-1">Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) =>
                        setServices(
                          services.map((s, i) =>
                            i === idx ? { ...s, title: e.target.value } : s
                          )
                        )
                      }
                      className="input-field"
                      placeholder="Dashboard Design"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--muted)] mb-1">Icon</label>
                    <select
                      value={service.icon}
                      onChange={(e) =>
                        setServices(
                          services.map((s, i) =>
                            i === idx ? { ...s, icon: e.target.value } : s
                          )
                        )
                      }
                      className="input-field"
                    >
                      <option value="BarChart">BarChart</option>
                      <option value="Database">Database</option>
                      <option value="Terminal">Terminal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Description</label>
                  <textarea
                    value={service.desc}
                    onChange={(e) =>
                      setServices(
                        services.map((s, i) =>
                          i === idx ? { ...s, desc: e.target.value } : s
                        )
                      )
                    }
                    className="input-field min-h-[80px]"
                    placeholder="Describe the service..."
                  />
                </div>
              </div>
            ))}

            {services.length > 0 && (
              <button onClick={saveServices} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Services"}
              </button>
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="card space-y-6">
            <h2 className="text-xl font-semibold">Edit Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Phone</label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="input-field"
                  placeholder="e.g. +1 234 567 890"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={contact.linkedin}
                  onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                  className="input-field"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <button onClick={saveContact} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Contact"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Project Editor Component
function ProjectEditor({
  project,
  onUpdate,
  onRemove,
  onDeleteImage,
  setProjectTempImages,
}: {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onRemove: () => void;
  onDeleteImage: (url: string) => Promise<void>;
  setProjectTempImages: React.Dispatch<React.SetStateAction<Record<string, { url: string; file?: File; isExisting: boolean }[]>>>;
}) {
  const [images, setImages] = useState<{ url: string; file?: File; isExisting: boolean }[]>(
    project.images.map(url => ({ url, isExisting: true }))
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  const prevImagesRef = useRef<{ url: string; file?: File; isExisting: boolean }[]>(images);
  const prevImagesUrlsRef = useRef<string[]>([]);

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { url: newImageUrl.trim(), isExisting: true }]);
      setNewImageUrl("");
    }
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    if (img.isExisting) {
      await onDeleteImage(img.url);
    } else if (img.file) {
      URL.revokeObjectURL(img.url);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  // Update parent when images change
  useEffect(() => {
    const currentUrls = images.map(i => i.url);
    if (JSON.stringify(currentUrls) !== JSON.stringify(prevImagesUrlsRef.current)) {
      onUpdate({ images: currentUrls });
      prevImagesUrlsRef.current = currentUrls;
    }
  }, [images, onUpdate]);

  // Update global temp images
  useEffect(() => {
    setProjectTempImages(prev => ({ ...prev, [project.id]: images }));
  }, [images, project.id, setProjectTempImages]);

  // Compare with previous images for deletion
  useEffect(() => {
    const prevImages = prevImagesRef.current;
    const deletedImages = prevImages.filter(img => !images.find(i => i.url === img.url));
    deletedImages.forEach(img => {
      if (img.isExisting) {
        onDeleteImage(img.url);
      } else if (img.file) {
        URL.revokeObjectURL(img.url);
      }
    });
    prevImagesRef.current = images;
  }, [images, onDeleteImage]);

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">Project</h3>
        <button onClick={onRemove} className="text-red-500 hover:text-red-400">
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--muted)] mb-1">Title</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="input-field"
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--muted)] mb-1">Link</label>
          <input
            type="url"
            value={project.link || ""}
            onChange={(e) => onUpdate({ link: e.target.value })}
            className="input-field"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[var(--muted)] mb-1">
          Description (appears on hover)
        </label>
        <textarea
          value={project.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="input-field min-h-[80px]"
          placeholder="Describe the project..."
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm text-[var(--muted)] mb-1">Images</label>

        {/* Existing images */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img.url}
                  alt={`Project image ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add image by URL */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="input-field flex-1"
            placeholder="Image URL"
          />
          <button onClick={addImageUrl} className="btn-secondary">
            Add URL
          </button>
        </div>

        {/* Upload image */}
        <label className="btn-secondary cursor-pointer inline-block">
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const blobUrl = URL.createObjectURL(file);
                setImages([...images, { url: blobUrl, file, isExisting: false }]);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
