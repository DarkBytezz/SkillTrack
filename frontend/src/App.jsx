
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  Plus,
  X,
  Trash2,
  Pencil,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import "./App.css";

const API = "http://localhost:8080/api/skills";

const initialForm = {
  name: "",
  proficiency: "Beginner",
  goal: "",
  targetDate: "",
  progress: 0,
};

function App() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    try {
      const response = await axios.get(API);
      setSkills(response.data);
      setError("");
    } catch (err) {
      setError("Unable to connect to the server. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEditForm = (skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name || "",
      proficiency: skill.proficiency || "Beginner",
      goal: skill.goal || "",
      targetDate: skill.targetDate || "",
      progress: skill.progress ?? 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(API, form);
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      fetchSkills();
    } catch (err) {
      setError("Could not save the skill. Please try again.");
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchSkills();
    } catch (err) {
      setError("Could not delete this skill.");
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name?.toLowerCase().includes(search.toLowerCase())
  );

  const averageProgress = skills.length
    ? Math.round(
        skills.reduce((sum, skill) => sum + (skill.progress || 0), 0) /
          skills.length
      )
    : 0;

  const completedSkills = skills.filter(
    (skill) => skill.progress === 100
  ).length;

  const inProgress = skills.filter(
    (skill) => skill.progress > 0 && skill.progress < 100
  ).length;

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">M</div>

        <nav>
          <button className="nav-item active" title="Dashboard">
            <LayoutDashboard size={21} />
          </button>
          <button className="nav-item" title="My Skills">
            <BookOpen size={21} />
          </button>
          <button className="nav-item" title="Goals">
            <Target size={21} />
          </button>
          <button className="nav-item" title="Analytics">
            <ChartNoAxesCombined size={21} />
          </button>
        </nav>

        <button className="nav-item settings" title="Settings">
          <Settings size={21} />
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div className="search-box">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search your skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="profile">
            <button className="notification-btn" title="Notifications">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>

            <div className="avatar">M</div>
            <div className="profile-info">
              <strong>My Profile</strong>
              <span>SkillTrack Student</span>
            </div>
          </div>
        </header>

        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR PERSONAL LEARNING SPACE</p>
            <h1>Dashboard</h1>
            <p className="subtitle">
              Track your learning journey and keep making progress.
            </p>
          </div>

          <button className="primary-btn" onClick={openAddForm}>
            <Plus size={18} />
            Add new skill
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Welcome section */}
        <section className="welcome-section">
          <div className="welcome-text">
            <span className="welcome-tag">
              <Sparkles size={14} /> KEEP LEARNING
            </span>
            <h2>Small steps, big achievements.</h2>
            <p>
              Every skill you learn brings you closer to your goals.
              Stay consistent and keep growing!
            </p>
            <button className="welcome-btn" onClick={openAddForm}>
              Start learning <span>→</span>
            </button>
          </div>

          <div className="welcome-illustration">
            <div className="illustration-circle">✦</div>
            <div className="illustration-label">YOUR NEXT LEVEL</div>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card peach">
            <div className="stat-top">
              <span>Total skills</span>
              <BookOpen size={20} />
            </div>
            <h2>{skills.length}</h2>
            <p>Skills in your learning list</p>
          </div>

          <div className="stat-card mint">
            <div className="stat-top">
              <span>Average progress</span>
              <ChartNoAxesCombined size={20} />
            </div>
            <h2>{averageProgress}%</h2>
            <p>Across all your skills</p>
          </div>

          <div className="stat-card yellow">
            <div className="stat-top">
              <span>In progress</span>
              <Target size={20} />
            </div>
            <h2>{inProgress}</h2>
            <p>Skills you're currently learning</p>
          </div>

          <div className="stat-card blue">
            <div className="stat-top">
              <span>Completed</span>
              <Sparkles size={20} />
            </div>
            <h2>{completedSkills}</h2>
            <p>Skills with 100% progress</p>
          </div>
        </section>

        {/* Skills section */}
        <section className="skills-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR DEVELOPMENT</p>
              <h2>My skills</h2>
            </div>

            <button className="secondary-btn" onClick={openAddForm}>
              <Plus size={17} /> Add skill
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading your skills...</p>
            </div>
          ) : filteredSkills.length > 0 ? (
            <div className="skills-grid">
              {filteredSkills.map((skill, index) => (
                <div className="skill-card" key={skill.id}>
                  <div className="skill-card-top">
                    <span className={`skill-icon icon-${index % 4}`}>
                      <BookOpen size={21} />
                    </span>

                    <div className="skill-actions">
                      <button
                        title="Edit skill"
                        onClick={() => openEditForm(skill)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Delete skill"
                        onClick={() => deleteSkill(skill.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3>{skill.name}</h3>
                  <span className="level">{skill.proficiency}</span>

                  <p className="skill-goal">
                    {skill.goal || "No learning goal added yet"}
                  </p>

                  <div className="progress-info">
                    <span>Learning progress</span>
                    <strong>{skill.progress || 0}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, skill.progress || 0)
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="target-date">
                    <CalendarDays size={14} />
                    <span>
                      Target: {skill.targetDate || "Not set"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <BookOpen size={30} />
              </div>
              <h3>
                {search ? "No matching skills" : "Your learning journey starts here"}
              </h3>
              <p>
                {search
                  ? "Try searching with a different skill name."
                  : "Add your first skill and start tracking your progress."}
              </p>
              {!search && (
                <button className="primary-btn" onClick={openAddForm}>
                  <Plus size={17} /> Add your first skill
                </button>
              )}
            </div>
          )}
        </section>

        {/* Learning overview */}
        <section className="overview-section">
          <div className="overview-card">
            <div>
              <p className="eyebrow">YOUR JOURNEY</p>
              <h3>Learning overview</h3>
              <p>Keep an eye on your overall skill development.</p>
            </div>

            <div className="overview-progress">
              <div
                className="progress-ring"
                style={{
                  background: `conic-gradient(#83aa96 ${averageProgress * 3.6}deg, #edf0ed 0deg)`,
                }}
              >
                <div>{averageProgress}%</div>
              </div>

              <div>
                <strong>Overall progress</strong>
                <p>Average across your skills</p>
              </div>
            </div>
          </div>

          <div className="overview-card deadline-card">
            <p className="eyebrow">STAY ON TRACK</p>
            <h3>Upcoming targets</h3>

            {skills
              .filter((skill) => skill.targetDate)
              .sort((a, b) =>
                a.targetDate.localeCompare(b.targetDate)
              )
              .slice(0, 4).length > 0 ? (
              skills
                .filter((skill) => skill.targetDate)
                .sort((a, b) =>
                  a.targetDate.localeCompare(b.targetDate)
                )
                .slice(0, 4)
                .map((skill) => (
                  <div className="deadline-item" key={skill.id}>
                    <div>
                      <strong>{skill.name}</strong>
                      <span>{skill.targetDate}</span>
                    </div>
                    <span className="deadline-progress">
                      {skill.progress}%
                    </span>
                  </div>
                ))
            ) : (
              <p className="no-deadlines">
                Add target dates to your skills to see them here.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Add / Edit Skill Modal */}
      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <form className="skill-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <div>
                <p className="eyebrow">BUILD YOUR FUTURE</p>
                <h2>{editingId ? "Update skill" : "Add a new skill"}</h2>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                <X size={21} />
              </button>
            </div>

            <label>
              Skill name
              <input
                type="text"
                placeholder="e.g. React, Python, UI/UX Design"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Proficiency level
              <select
                value={form.proficiency}
                onChange={(e) =>
                  setForm({ ...form, proficiency: e.target.value })
                }
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>

            <label>
              Learning goal
              <textarea
                placeholder="What do you want to achieve?"
                value={form.goal}
                onChange={(e) =>
                  setForm({ ...form, goal: e.target.value })
                }
                rows={3}
              />
            </label>

            <div className="form-row">
              <label>
                Target date
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) =>
                    setForm({ ...form, targetDate: e.target.value })
                  }
                />
              </label>

              <label>
                Progress (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      progress: Math.min(100, Math.max(0, Number(e.target.value))),
                    })
                  }
                />
              </label>
            </div>

            <button type="submit" className="primary-btn submit-btn">
              {editingId ? "Save changes" : "Add skill"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
