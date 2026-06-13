import { useState, useEffect } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

const STATUS_BADGE = { "Completed": "badge-green", "In Progress": "badge-blue", "Pending": "badge-yellow" };

function Tasks({ onNav, onLogout, user }) {
  const role = user?.role;
  const [tasks,    setTasks]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState({ task_name: "", assigned_to: "", status: "Pending" });
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = () => {
    setLoading(true);
    api.get("/tasks")
      .then(r => setTasks(r.data || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", form);
      fetchTasks();
    } catch (err) {
      console.error("Create task failed:", err);
    }
    setForm({ task_name: "", assigned_to: "", status: "Pending" });
    setShowForm(false);
  };

  const counts = {
    total:      tasks.length,
    completed:  tasks.filter(t => t.status === "Completed").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    pending:    tasks.filter(t => t.status === "Pending").length,
  };

  return (
    <PageShell title="Tasks" subtitle="Track and assign site work" onNav={onNav} onLogout={onLogout} user={user}>
      {/* Mini stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[["Total", counts.total, "#0f172a"], ["Completed", counts.completed, "#10b981"], ["In Progress", counts.inProgress, "#3b82f6"], ["Pending", counts.pending, "#f59e0b"]].map(([l, v, c]) => (
          <div key={l} className="bs-card" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{l}</span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700, color: c }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        {role !== "ENGINEER" && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && role !== "ENGINEER" && (
        <div className="bs-card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Add New Task</div>
          <form onSubmit={addTask}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Task Name *</label>
                <input className="bs-input" placeholder="e.g. Roof Waterproofing" value={form.task_name}
                  onChange={e => setForm({ ...form, task_name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Assigned To *</label>
                <input className="bs-input" placeholder="Engineer name" value={form.assigned_to}
                  onChange={e => setForm({ ...form, assigned_to: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Status</label>
                <select className="bs-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Pending</option><option>In Progress</option><option>Completed</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-primary" type="submit">Save Task</button>
              <button className="btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bs-card">
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading tasks…</div>
        ) : (
          <table className="bs-table">
            <thead><tr><th>#</th><th>Task Name</th><th>Assigned To</th><th>Status</th></tr></thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: 32 }}>
                  No tasks yet. {role === "ADMIN" ? "Use 'Generate Demo Data' on the Dashboard." : ""}
                </td></tr>
              ) : tasks.map((t, i) => (
                <tr key={t.id}>
                  <td style={{ color: "#94a3b8", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</td>
                  <td style={{ fontWeight: 500 }}>{t.task_name}</td>
                  <td style={{ color: "#475569" }}>{t.assigned_to}</td>
                  <td><span className={`badge ${STATUS_BADGE[t.status] || "badge-gray"}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageShell>
  );
}

export default Tasks;
