import React, { useState, useEffect, useRef } from 'react';
import {
    Menu,
    X,
    Linkedin,
    Phone,
    Database,
    BarChart,
    Code,
    Brain,
    Terminal,
    ExternalLink,
    Briefcase,
    GraduationCap,
    Lock,
    Unlock,
    Save,
    Edit3,
    Plus,
    Trash2,
    LogIn,
    LogOut,
    Sun,
    Moon
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Admin Credentials ---
const ADMIN_EMAIL = "admin@MS2004.com";
const ADMIN_PASSWORD = "Admin_2004@MohamedSamy";

// --- Default Data (Fallback) ---
const defaultData = {
    hero: {
        subtitle: "Data Analyst Portfolio",
        title: "MOHAMED SAMY",
        description: "Transforming raw data into actionable insights through Python, SQL, and Visualization.",
    },
    about: {
        title: "ABOUT ME",
        p1_start: "I am an",
        p1_highlight: "Intern Data Analyst",
        p1_end: "with a strong foundation in data analysis and visualization. I specialize in turning complex datasets into clear narratives.",
        p2: "Skilled in Python, SQL, Excel, Power BI, and Tableau, with hands-on experience in data cleaning, exploratory data analysis (EDA), and dashboard creation. My background in customer-facing roles has honed my communication and problem-solving abilities, making me effective at translating technical findings for non-technical stakeholders.",
        tags: ["Motivated", "Fast Learner", "Problem Solver"]
    },
    education: [
        {
            id: 1,
            degree: "Google Data Analytics Professional Certificate",
            school: "Coursera (Google)",
            date: "Expected Completion: 2026",
            desc: "Focuses on the entire data analysis life cycle. Skills include Data cleaning, analysis, visualization, and R/SQL programming."
        },
        {
            id: 2,
            degree: "Digital Egypt Pioneers Initiative (DEPI)",
            school: "Ministry of Communications - Data Analysis Track",
            date: "Nov 2024 : May 2025",
            desc: "Intensive 7-month bootcamp covering Excel, SQL, Python, and Freelancing skills. Applied skills in real-world technical projects."
        },
        {
            id: 3,
            degree: "National Telecom Institute (NTI)",
            school: "Ministry of Communications - Data Analysis Track",
            date: "Dec 2024 : Feb 2025",
            desc: "Bootcamp covering Excel, SQL, Python, and Freelancing skills."
        }
    ],
    experience: {
        title: "Freelance Data Analyst",
        date: "Jan 2020 – Present",
        company: "Self-Employed / Remote",
        points: [
            "Transforming raw data into actionable insights for clients using Excel, SQL, and Python.",
            "Designing interactive dashboards in Power BI and Tableau to visualize KPIs and business trends.",
            "Conducting data cleaning and preprocessing to ensure 100% accuracy for analysis projects.",
            "Applying statistical analysis to interpret complex datasets and support data-driven decision-making."
        ]
    },
    projects: [
        {
            id: 1,
            title: "Sales Performance Dashboard",
            tools: "Power BI, SQL",
            desc: "An interactive dashboard tracking regional sales performance, identifying top-selling products and seasonal trends.",
            link: "#"
        },
        {
            id: 2,
            title: "Customer Churn Analysis",
            tools: "Python, Pandas, Scikit-learn",
            desc: "Analyzed customer behavior data to predict churn rates and recommended retention strategies based on key indicators.",
            link: "#"
        },
        {
            id: 3,
            title: "E-commerce Web Scraper",
            tools: "Python, BeautifulSoup",
            desc: "Automated script to scrape product pricing and reviews from competitor websites for market analysis.",
            link: "#"
        }
    ],
    skills: {
        technical: {
            analysis: ["Data Cleaning", "EDA", "Web Scraping", "Pattern Recognition"],
            programming: ["Python (Pandas, NumPy)", "SQL"],
            viz: ["Power BI", "Tableau", "Advanced Excel", "MS Office"]
        },
        soft: [
            { title: "Problem-Solving", desc: "Ability to approach complex data challenges logically." },
            { title: "Analytical Thinking", desc: "Translating numbers into tangible business concepts." },
            { title: "Communication", desc: "Presenting technical insights to non-technical stakeholders." },
            { title: "Adaptability & Fast Learning", desc: "Quickly mastering new tools (e.g., learned Python & SQL for DEPI)." }
        ]
    },
    services: [
        { title: "Dashboard Design", desc: "Interactive and automated dashboards using Power BI and Tableau to track KPIs.", icon: "BarChart" },
        { title: "Data Cleaning", desc: "Preprocessing complex datasets to ensure 100% accuracy and readiness for analysis.", icon: "Database" },
        { title: "Statistical Analysis", desc: "Using Python and SQL to uncover hidden patterns and drive business decisions.", icon: "Terminal" }
    ],
    contact: {
        phone: "+20 111 871 6536",
        linkedin: "https://www.linkedin.com/in/mohamed-samy-637b14274/"
    }
};

// --- Components ---

const EditableText = ({ text, isEditing, onChange, className, type = "input", placeholder = "", isDarkMode = true }) => {
    // Safe rendering
    const safeText = (typeof text === 'string' || typeof text === 'number') ? text : '';

    if (!isEditing) return <span className={className}>{safeText}</span>;

    const inputBgClass = isDarkMode
        ? "bg-neutral-800 text-white border-emerald-500/50"
        : "bg-white text-neutral-900 border-emerald-500/50 shadow-sm";

    return type === "textarea" ? (
        <textarea
            value={safeText}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputBgClass} border rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
            rows={4}
            placeholder={placeholder}
        />
    ) : (
        <input
            value={safeText}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputBgClass} border rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
            placeholder={placeholder}
        />
    );
};

const IconMap = ({ name, className }) => {
    const icons = { BarChart, Database, Terminal, Code, Brain };
    const Icon = icons[name] || BarChart;
    return <Icon className={className} />;
};

// --- Main App Component ---

export default function App() {
    const [data, setData] = useState(defaultData);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [saving, setSaving] = useState(false);

    // --- Auth & Data Fetching ---
    useEffect(() => {
        const initAuth = async () => {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
        };
        initAuth();
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(
            doc(db, 'artifacts', appId, 'public', 'data', 'portfolio', 'main'),
            (docSnap) => {
                if (docSnap.exists()) {
                    const remoteData = docSnap.data();
                    setData(prev => ({ ...prev, ...remoteData }));
                }
            },
            (error) => console.error("Error fetching data:", error)
        );
        return () => unsubscribe();
    }, [user]);

    // --- Handlers ---

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'portfolio', 'main'), data);
            setIsEditing(false);
        } catch (e) {
            console.error("Error saving:", e);
            alert("Failed to save changes. Check permissions.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setLoginModalOpen(false);
            setEmail("");
            setPassword("");
        } else {
            alert("Invalid Email or Password");
        }
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setIsEditing(false);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Helper: Deep copy
    const updateData = (path, value) => {
        setData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            let current = newData;
            const keys = path.split('.');
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const updateArrayItem = (section, index, field, value) => {
        setData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            if (newData[section] && newData[section][index]) {
                newData[section][index][field] = value;
            }
            return newData;
        });
    };

    const updateNestedArrayItem = (pathArray, index, value) => {
        setData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            let current = newData;
            for (let i = 0; i < pathArray.length; i++) {
                if (!current[pathArray[i]]) current[pathArray[i]] = [];
                current = current[pathArray[i]];
            }
            if (Array.isArray(current)) {
                current[index] = value;
            }
            return newData;
        });
    };

    const addArrayItem = (section, template) => {
        setData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            if (Array.isArray(newData[section])) {
                newData[section].push(template);
            }
            return newData;
        });
    };

    const removeArrayItem = (section, index) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        setData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            if (Array.isArray(newData[section])) {
                newData[section] = newData[section].filter((_, i) => i !== index);
            }
            return newData;
        });
    };

    const scrollToSection = (id) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const navItems = [
        { id: 'about', label: 'About' },
        { id: 'education', label: 'Education' },
        { id: 'experience', label: 'Experience' },
        { id: 'projects', label: 'Projects' },
        { id: 'skills', label: 'Skills' },
        { id: 'services', label: 'Services' },
        { id: 'contact', label: 'Contact' },
    ];

    // Theme Classes
    const theme = {
        bg: isDarkMode ? "bg-neutral-950" : "bg-gray-50",
        bgAlt: isDarkMode ? "bg-neutral-900" : "bg-white",
        text: isDarkMode ? "text-neutral-200" : "text-neutral-800",
        textMuted: isDarkMode ? "text-neutral-400" : "text-neutral-600",
        textHeading: isDarkMode ? "text-white" : "text-neutral-900",
        border: isDarkMode ? "border-neutral-800" : "border-gray-200",
        cardHover: isDarkMode ? "hover:border-emerald-500/30" : "hover:border-emerald-500/50 hover:shadow-lg",
        navBg: isDarkMode ? "bg-neutral-950/80" : "bg-white/80",
        navText: isDarkMode ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-emerald-600",
        inputBg: isDarkMode ? "bg-neutral-950" : "bg-white",
        heroGradient: isDarkMode
            ? "from-neutral-900 via-neutral-950 to-neutral-950"
            : "from-gray-100 via-gray-50 to-gray-50",
    };

    return (
        <div className={`min-h-screen font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300 ${theme.bg} ${theme.text}`}>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${theme.navBg} ${theme.border}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('home')}>
                            <span className={`text-xl font-bold tracking-tighter ${theme.textHeading}`}>M.SAMY<span className="text-emerald-500">.</span></span>
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
                                onClick={toggleTheme}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-neutral-800 text-yellow-400' : 'hover:bg-gray-100 text-neutral-600'}`}
                                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {/* Admin Controls */}
                            {isAdmin && (
                                <div className={`flex items-center ml-4 border-l ${theme.border} pl-4 space-x-4`}>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${isEditing ? 'bg-emerald-500 text-black' : isDarkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-gray-200 text-neutral-600'}`}
                                    >
                                        {isEditing ? <X size={14} className="mr-1"/> : <Edit3 size={14} className="mr-1"/>}
                                        {isEditing ? 'Editing On' : 'Edit Mode'}
                                    </button>

                                    {isEditing && (
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                                        >
                                            <Save size={14} className="mr-1"/>
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className={`flex items-center px-3 py-1 rounded-full text-xs font-bold hover:text-red-400 transition-colors ${isDarkMode ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700' : 'bg-gray-200 text-neutral-600 hover:bg-gray-300'}`}
                                    >
                                        <LogOut size={14} className="mr-1"/>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-yellow-400' : 'text-neutral-600'}`}
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`${theme.textMuted} hover:${theme.textHeading} p-2`}
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                                    className={`block w-full text-left px-3 py-4 text-base font-medium ${theme.navText} hover:${theme.bg}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            {isAdmin ? (
                                <>
                                    <button
                                        onClick={() => { setIsEditing(!isEditing); setIsMenuOpen(false); }}
                                        className={`block w-full text-left px-3 py-4 text-base font-medium text-emerald-500 ${isDarkMode ? 'bg-neutral-900/50' : 'bg-gray-100'}`}
                                    >
                                        {isEditing ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                                    </button>
                                    <button
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className={`block w-full text-left px-3 py-4 text-base font-medium text-red-500 ${isDarkMode ? 'bg-neutral-900/50' : 'bg-gray-100'}`}
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setLoginModalOpen(true); setIsMenuOpen(false); }}
                                    className={`block w-full text-left px-3 py-4 text-base font-medium text-emerald-500 ${isDarkMode ? 'bg-neutral-900/50' : 'bg-gray-100'}`}
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="min-h-screen flex items-center justify-center relative pt-16">
                <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${theme.heroGradient} opacity-50`}></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10 w-full">
                    <div className="mb-4">
                        <EditableText
                            isEditing={isEditing}
                            isDarkMode={isDarkMode}
                            text={data.hero.subtitle}
                            onChange={(val) => updateData('hero.subtitle', val)}
                            className="text-emerald-500 font-medium tracking-widest uppercase text-sm animate-pulse block"
                        />
                    </div>
                    <div className="mb-6">
                        <EditableText
                            isEditing={isEditing}
                            isDarkMode={isDarkMode}
                            text={data.hero.title}
                            onChange={(val) => updateData('hero.title', val)}
                            className={`text-5xl md:text-7xl font-bold tracking-tight block w-full text-center bg-transparent ${theme.textHeading}`}
                        />
                    </div>
                    <div className="mb-10 max-w-2xl mx-auto">
                        <EditableText
                            isEditing={isEditing}
                            isDarkMode={isDarkMode}
                            text={data.hero.description}
                            onChange={(val) => updateData('hero.description', val)}
                            type="textarea"
                            className={`text-xl md:text-2xl font-light block w-full text-center bg-transparent ${theme.textMuted}`}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => scrollToSection('contact')}
                            className={`px-8 py-3 font-semibold rounded-full transition-all duration-300 ${isDarkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-neutral-700'}`}
                        >
                            Contact Me
                        </button>
                        <button
                            onClick={() => scrollToSection('experience')}
                            className={`px-8 py-3 bg-transparent border font-semibold rounded-full transition-all duration-300 ${isDarkMode ? 'border-neutral-700 text-white hover:bg-neutral-900 hover:border-neutral-500' : 'border-neutral-300 text-neutral-900 hover:bg-gray-100 hover:border-emerald-500'}`}
                        >
                            View Experience
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className={`py-20 ${theme.bgAlt}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className={`text-3xl font-bold mb-6 flex items-center ${theme.textHeading}`}>
                                <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
                                <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={data.about.title} onChange={(v) => updateData('about.title', v)} />
                            </h2>

                            <div className={`${theme.textMuted} leading-relaxed mb-6 text-lg`}>
                                <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={data.about.p1_start} onChange={(v) => updateData('about.p1_start', v)} />
                                {' '}
                                <span className="text-emerald-500 font-medium">
                  <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={data.about.p1_highlight} onChange={(v) => updateData('about.p1_highlight', v)} />
                </span>
                                {' '}
                                <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={data.about.p1_end} onChange={(v) => updateData('about.p1_end', v)} />
                            </div>

                            <div className={`${theme.textMuted} leading-relaxed mb-6`}>
                                <EditableText
                                    isEditing={isEditing}
                                    isDarkMode={isDarkMode}
                                    text={data.about.p2}
                                    onChange={(v) => updateData('about.p2', v)}
                                    type="textarea"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-wrap gap-4 mt-8">
                                {data.about.tags.map((tag, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className={`px-4 py-2 rounded text-sm text-emerald-500 border ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-emerald-500/30'}`}>
                                            <EditableText
                                                isEditing={isEditing}
                                                isDarkMode={isDarkMode}
                                                text={tag}
                                                onChange={(v) => updateNestedArrayItem(['about', 'tags'], idx, v)}
                                            />
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => {
                                                    const newData = JSON.parse(JSON.stringify(data));
                                                    newData.about.tags = newData.about.tags.filter((_, i) => i !== idx);
                                                    setData(newData);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            const newData = JSON.parse(JSON.stringify(data));
                                            newData.about.tags.push("New Tag");
                                            setData(newData);
                                        }}
                                        className={`px-3 py-2 rounded border ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : 'bg-white border-gray-300 text-neutral-600'} hover:text-emerald-500`}
                                    >
                                        <Plus size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            {/* Decorative elements representing code/data */}
                            <div className={`aspect-square rounded-2xl border p-8 relative overflow-hidden group transition-all ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200 shadow-xl'} ${theme.cardHover}`}>
                                <Terminal className="w-16 h-16 text-emerald-500 mb-4 opacity-50" />
                                <div className={`space-y-3 font-mono text-sm ${isDarkMode ? 'text-neutral-500' : 'text-neutral-600'}`}>
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

            {/* Education Section */}
            <section id="education" className={`py-20 ${theme.bg}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className={`text-3xl font-bold flex items-center ${theme.textHeading}`}>
                            <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
                            EDUCATION
                        </h2>
                        {isEditing && (
                            <button
                                onClick={() => addArrayItem('education', { id: Date.now(), degree: "New Degree", school: "University", date: "2024", desc: "Description" })}
                                className="flex items-center text-emerald-500 text-sm hover:text-emerald-400"
                            >
                                <Plus size={16} className="mr-1" /> Add Education
                            </button>
                        )}
                    </div>

                    <div className="space-y-8">
                        {data.education.map((item, index) => (
                            <div key={item.id} className={`relative group p-6 rounded-xl border transition-all duration-300 ${theme.bgAlt} ${theme.border} ${theme.cardHover}`}>
                                {isEditing && (
                                    <button
                                        onClick={() => removeArrayItem('education', index)}
                                        className="absolute top-4 right-4 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}

                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                    <div className="flex items-center w-full md:w-auto">
                                        <GraduationCap className="text-emerald-500 mr-3 flex-shrink-0" size={24} />
                                        <h3 className={`text-xl font-bold w-full ${theme.textHeading}`}>
                                            <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={item.degree} onChange={(v) => updateArrayItem('education', index, 'degree', v)} />
                                        </h3>
                                    </div>
                                    <span className={`${theme.textMuted} text-sm mt-2 md:mt-0 whitespace-nowrap md:ml-4`}>
                    <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={item.date} onChange={(v) => updateArrayItem('education', index, 'date', v)} />
                  </span>
                                </div>
                                <p className="text-emerald-500 mb-2 font-medium">
                                    <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={item.school} onChange={(v) => updateArrayItem('education', index, 'school', v)} />
                                </p>
                                <p className={theme.textMuted}>
                                    <EditableText type="textarea" isEditing={isEditing} isDarkMode={isDarkMode} text={item.desc} onChange={(v) => updateArrayItem('education', index, 'desc', v)} />
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className={`py-20 ${theme.bgAlt}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className={`text-3xl font-bold mb-12 flex items-center ${theme.textHeading}`}>
                        <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
                        EXPERIENCE
                    </h2>

                    <div className={`relative border-l-2 ml-4 md:ml-6 space-y-12 ${isDarkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
                        <div className="relative pl-8 md:pl-12">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 ${isDarkMode ? 'border-neutral-900' : 'border-white'}`}></div>

                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                                <h3 className={`text-2xl font-bold ${theme.textHeading}`}>
                                    <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={data.experience.title} onChange={(v) => updateData('experience.title', v)} />
                                </h3>
                                <span className="text-emerald-500 font-medium">
                   <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={data.experience.date} onChange={(v) => updateData('experience.date', v)} />
                </span>
                            </div>
                            <p className={`${theme.textMuted} mb-6 font-medium`}>
                                <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={data.experience.company} onChange={(v) => updateData('experience.company', v)} />
                            </p>

                            <ul className={`space-y-4 ${theme.textMuted}`}>
                                {data.experience.points.map((point, idx) => (
                                    <li key={idx} className="flex items-start group relative">
                                        <span className="text-emerald-500 mr-2 mt-1 flex-shrink-0">▹</span>
                                        <div className="w-full">
                                            <EditableText
                                                isEditing={isEditing}
                                                isDarkMode={isDarkMode}
                                                text={point}
                                                onChange={(v) => updateNestedArrayItem(['experience', 'points'], idx, v)}
                                                type="textarea"
                                            />
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => {
                                                    const newData = JSON.parse(JSON.stringify(data));
                                                    newData.experience.points = newData.experience.points.filter((_, i) => i !== idx);
                                                    setData(newData);
                                                }}
                                                className="absolute -right-6 top-1 text-red-500 opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </li>
                                ))}
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            const newData = JSON.parse(JSON.stringify(data));
                                            newData.experience.points.push("New responsibility point");
                                            setData(newData);
                                        }}
                                        className="flex items-center text-sm text-emerald-500 mt-2"
                                    >
                                        <Plus size={14} className="mr-1"/> Add Point
                                    </button>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section (New) */}
            <section id="projects" className={`py-20 ${theme.bg}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className={`text-3xl font-bold flex items-center ${theme.textHeading}`}>
                            <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
                            PROJECTS
                        </h2>
                        {isEditing && (
                            <button
                                onClick={() => addArrayItem('projects', { id: Date.now(), title: "New Project", tools: "Tools Used", desc: "Project Description", link: "#" })}
                                className="flex items-center text-emerald-500 text-sm hover:text-emerald-400"
                            >
                                <Plus size={16} className="mr-1" /> Add Project
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.projects.map((project, index) => (
                            <div key={project.id} className={`rounded-xl border p-6 transition-all group relative flex flex-col ${theme.bgAlt} ${theme.border} ${theme.cardHover}`}>
                                {isEditing && (
                                    <button
                                        onClick={() => removeArrayItem('projects', index)}
                                        className="absolute top-4 right-4 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}

                                <h3 className={`text-xl font-bold mb-2 ${theme.textHeading}`}>
                                    <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={project.title} onChange={(v) => updateArrayItem('projects', index, 'title', v)} />
                                </h3>
                                <p className="text-xs text-emerald-500 font-mono mb-4">
                                    <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={project.tools} onChange={(v) => updateArrayItem('projects', index, 'tools', v)} />
                                </p>
                                <div className={`${theme.textMuted} text-sm mb-6 flex-grow`}>
                                    <EditableText type="textarea" isEditing={isEditing} isDarkMode={isDarkMode} text={project.desc} onChange={(v) => updateArrayItem('projects', index, 'desc', v)} />
                                </div>

                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center font-medium hover:text-emerald-500 mt-auto ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}
                                >
                                    View Project <ExternalLink size={16} className="ml-2" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className={`py-20 ${theme.bgAlt}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className={`text-3xl font-bold mb-12 flex items-center ${theme.textHeading}`}>
                        <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
                        SKILLS
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Technical Skills */}
                        <div className={`p-8 rounded-xl border ${theme.bg} ${theme.border}`}>
                            <div className="flex items-center mb-6">
                                <Code className="text-emerald-500 mr-3" />
                                <h3 className={`text-xl font-bold ${theme.textHeading}`}>Technical Skills</h3>
                            </div>
                            <div className="space-y-6">
                                {Object.entries(data.skills.technical).map(([key, skills]) => (
                                    <div key={key}>
                                        <h4 className={`${theme.textMuted} text-sm mb-2 uppercase tracking-wide capitalize`}>{key}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill, idx) => (
                                                <div key={idx} className="relative group">
                          <span className={`block px-3 py-1 rounded text-sm border ${isDarkMode ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-white text-neutral-700 border-gray-200 shadow-sm'}`}>
                             <EditableText
                                 isEditing={isEditing}
                                 isDarkMode={isDarkMode}
                                 text={skill}
                                 onChange={(v) => updateNestedArrayItem(['skills', 'technical', key], idx, v)}
                             />
                          </span>
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => {
                                                                const newData = JSON.parse(JSON.stringify(data));
                                                                newData.skills.technical[key] = newData.skills.technical[key].filter((_, i) => i !== idx);
                                                                setData(newData);
                                                            }}
                                                            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white opacity-0 group-hover:opacity-100"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const newData = JSON.parse(JSON.stringify(data));
                                                        newData.skills.technical[key].push("New Skill");
                                                        setData(newData);
                                                    }}
                                                    className={`px-2 py-1 rounded border ${isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : 'bg-white border-gray-300 text-neutral-500'} hover:text-emerald-500`}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Soft Skills */}
                        <div className={`p-8 rounded-xl border ${theme.bg} ${theme.border}`}>
                            <div className="flex items-center mb-6">
                                <Brain className="text-emerald-500 mr-3" />
                                <h3 className={`text-xl font-bold ${theme.textHeading}`}>Soft Skills</h3>
                            </div>
                            <ul className="space-y-4">
                                {data.skills.soft.map((skill, index) => (
                                    <li key={index} className={`p-4 rounded border group relative ${theme.bgAlt} ${theme.border}`}>
                                        {isEditing && (
                                            <button
                                                onClick={() => {
                                                    const newData = JSON.parse(JSON.stringify(data));
                                                    newData.skills.soft = newData.skills.soft.filter((_, i) => i !== index);
                                                    setData(newData);
                                                }}
                                                className="absolute top-2 right-2 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                        <h4 className={`font-medium ${theme.textHeading}`}>
                                            <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={skill.title} onChange={(v) => updateArrayItem('skills.soft', index, 'title', v)} />
                                        </h4>
                                        <p className={`text-sm mt-1 ${theme.textMuted}`}>
                                            <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={skill.desc} onChange={(v) => updateArrayItem('skills.soft', index, 'desc', v)} type="textarea" />
                                        </p>
                                    </li>
                                ))}
                                {isEditing && (
                                    <button
                                        onClick={() => addArrayItem('skills.soft', { title: "New Soft Skill", desc: "Description of skill" })}
                                        className={`w-full py-2 border border-dashed rounded ${isDarkMode ? 'border-neutral-700 text-neutral-500' : 'border-gray-300 text-neutral-500'} hover:text-emerald-500 hover:border-emerald-500`}
                                    >
                                        + Add Soft Skill
                                    </button>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className={`py-20 ${theme.bg}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className={`text-3xl font-bold mb-12 flex items-center ${theme.textHeading}`}>
                        <span className="w-12 h-1 bg-emerald-500 mr-4"></span>
                        SERVICES
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {data.services.map((service, index) => (
                            <div key={index} className={`p-6 rounded-lg border transition-colors group ${theme.bgAlt} ${theme.border} ${theme.cardHover}`}>
                                <div className={`mb-4 transition-colors ${theme.textMuted} group-hover:text-emerald-500`}>
                                    <IconMap name={service.icon} className="h-10 w-10" />
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${theme.textHeading}`}>
                                    <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={service.title} onChange={(v) => updateArrayItem('services', index, 'title', v)} />
                                </h3>
                                <p className={theme.textMuted}>
                                    <EditableText type="textarea" isEditing={isEditing} isDarkMode={isDarkMode} text={service.desc} onChange={(v) => updateArrayItem('services', index, 'desc', v)} />
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className={`py-24 relative overflow-hidden ${theme.bgAlt}`}>
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className={`text-3xl font-bold mb-8 ${theme.textHeading}`}>Ready to analyze your data?</h2>
                    <p className={`text-xl mb-12 ${theme.textMuted}`}>
                        I am available for freelance projects and internships. Let's discuss how data can help your business grow.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <div className={`flex items-center justify-center p-6 border rounded-xl transition-all group ${theme.bg} ${theme.border} ${theme.cardHover}`}>
                            <Phone className="mr-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <div className="text-left w-full">
                                <span className={`block text-xs uppercase tracking-wider ${theme.textMuted}`}>Phone & WhatsApp</span>
                                <span className={`font-medium block ${theme.textHeading}`}>
                   <EditableText isEditing={isEditing} isDarkMode={isDarkMode} text={data.contact.phone} onChange={(v) => updateData('contact.phone', v)} />
                </span>
                            </div>
                        </div>

                        <div className={`flex items-center justify-center p-6 border rounded-xl transition-all group ${theme.bg} ${theme.border} ${theme.cardHover}`}>
                            <Linkedin className="mr-3 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <div className="text-left w-full overflow-hidden">
                                <span className={`block text-xs uppercase tracking-wider ${theme.textMuted}`}>LinkedIn</span>
                                <a href={data.contact.linkedin} target="_blank" className={`font-medium hover:text-emerald-500 truncate block ${theme.textHeading}`}>
                                    {isEditing ? (
                                        <EditableText isEditing={true} isDarkMode={isDarkMode} text={data.contact.linkedin} onChange={(v) => updateData('contact.linkedin', v)} />
                                    ) : "Visit Profile"}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer & Login Trigger */}
            <footer className={`py-8 border-t text-center relative ${theme.bg} ${theme.border}`}>
                <p className={`text-sm ${theme.textMuted}`}>
                    © {new Date().getFullYear()} Mohamed Samy. All rights reserved.
                </p>

                {/* Sign In Button in Footer */}
                {!isAdmin && (
                    <button
                        onClick={() => setLoginModalOpen(true)}
                        className={`absolute bottom-4 right-4 text-xs font-bold uppercase tracking-widest flex items-center transition-colors ${theme.textMuted} hover:text-emerald-500`}
                    >
                        <LogIn size={12} className="mr-1" />
                        Sign In
                    </button>
                )}
            </footer>

            {/* Login Modal */}
            {loginModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className={`p-8 rounded-xl border w-full max-w-sm ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200 shadow-2xl'}`}>
                        <h3 className={`text-xl font-bold mb-4 flex items-center ${theme.textHeading}`}>
                            <Lock className="mr-2 text-emerald-500" size={20} />
                            Admin Access
                        </h3>
                        <p className={`text-sm mb-6 ${theme.textMuted}`}>Enter your credentials to edit portfolio.</p>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className={`block text-xs uppercase tracking-wider mb-1 ${theme.textMuted}`}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full border rounded p-3 focus:border-emerald-500 outline-none transition-colors ${theme.inputBg} ${theme.text} ${theme.border}`}
                                    placeholder="admin@example.com"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className={`block text-xs uppercase tracking-wider mb-1 ${theme.textMuted}`}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full border rounded p-3 focus:border-emerald-500 outline-none transition-colors ${theme.inputBg} ${theme.text} ${theme.border}`}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setLoginModalOpen(false)}
                                    className={`px-4 py-2 transition-colors ${theme.textMuted} hover:${theme.textHeading}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-emerald-500 text-white font-bold rounded hover:bg-emerald-600 transition-colors"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}