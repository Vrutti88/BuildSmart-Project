import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

const STATUS_BADGE = { Active: "badge-green", Completed: "badge-blue", Planning: "badge-yellow", Delayed: "badge-red" };
const fmt = v => "₹" + Number(v).toLocaleString("en-IN");

function Projects({ onNav, onLogout, user }) {
  const role = user?.role;
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form, setForm] = useState({ project_name: "", location: "", budget: "", status: "Active" });
  const [showForm, setShowForm] = useState(false);
  const [search,   setSearch]   = useState("");

  const fetchProjects = () => {
    setLoading(true);
    api.get("/projects")
      .then(r => setProjects(r.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", form);
      fetchProjects();
    } catch (err) {
      console.error("Create project failed:", err);
    }
    setForm({ project_name: "", location: "", budget: "", status: "Active" });
    setShowForm(false);
  };

  const filtered = projects.filter(p =>
    p.project_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell title="Projects" subtitle={`${projects.length} total projects`} onNav={onNav} onLogout={onLogout} user={user}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12 }}>
        <input
          className="bs-input" placeholder="Search projects or locations…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        {role !== "ENGINEER" && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && role !== "ENGINEER" && (
        <div className="bs-card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Add New Project</div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 160px", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Project Name *</label>
                <input className="bs-input" placeholder="e.g. Bridge Renovation" value={form.project_name}
                  onChange={e => setForm({ ...form, project_name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Location *</label>
                <input className="bs-input" placeholder="e.g. Mumbai" value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Budget (₹) *</label>
                <input className="bs-input" type="number" placeholder="e.g. 5000000" value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Status</label>
                <select className="bs-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option><option>Planning</option><option>Completed</option><option>Delayed</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-primary" type="submit">Save Project</button>
              <button className="btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bs-card">
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading projects…</div>
        ) : (
          <table className="bs-table">
            <thead><tr><th>#</th><th>Project Name</th><th>Location</th><th>Budget</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>
                  No projects found. {role === "ADMIN" ? "Use "Generate Demo Data" on the Dashboard." : ""}
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: "#94a3b8", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</td>
                  <td style={{ fontWeight: 500 }}>{p.project_name}</td>
                  <td>{p.location}</td>
                  <td style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600 }}>{fmt(p.budget)}</td>
                  <td><span className={`badge ${STATUS_BADGE[p.status] || "badge-gray"}`}>{p.status || "Active"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageShell>
  );
}

export default Projects;
