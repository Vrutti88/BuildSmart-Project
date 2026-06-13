import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

const STATUS_BADGE = { Active: "badge-green", Completed: "badge-blue", Planning: "badge-yellow", Delayed: "badge-red" };

const EMPTY_STATS = [
  { label: "Active Projects",    value: "—", delta: "No data yet",      color: "#f59e0b" },
  { label: "Total Tasks",        value: "—", delta: "No data yet",      color: "#3b82f6" },
  { label: "Pending Approvals",  value: "—", delta: "No data yet",      color: "#ef4444" },
  { label: "Total Budget",       value: "—", delta: "No data yet",      color: "#10b981" },
];

const fmt = v => {
  const n = Number(v);
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000)   return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
};

function Dashboard({ onNav, onLogout, user }) {
  const [projects,  setProjects]  = useState([]);
  const [stats,     setStats]     = useState(EMPTY_STATS);
  const [activity,  setActivity]  = useState([]);
  const [seeding,   setSeeding]   = useState(false);
  const [seedMsg,   setSeedMsg]   = useState("");

  const loadData = async () => {
    try {
      const [projRes, taskRes, approvalRes, reportRes, logRes] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks"),
        api.get("/approvals"),
        api.get("/reports"),
        api.get("/monitoring/logs"),
      ]);

      const projs     = projRes.data    || [];
      const tasks     = taskRes.data    || [];
      const approvals = approvalRes.data || [];
      const report    = reportRes.data  || {};
      const logs      = logRes.data     || [];

      setProjects(projs.slice(0, 5));

      const active   = projs.filter(p => p.status === "Active").length;
      const pending  = approvals.filter(a => a.status === "Pending").length;
      const totalBud = report.totalBudget || 0;

      setStats([
        { label: "Active Projects",   value: active   || projs.length, delta: `${projs.length} total projects`,  color: "#f59e0b" },
        { label: "Total Tasks",       value: tasks.length,              delta: `${tasks.filter(t=>t.status==="In Progress").length} in progress`, color: "#3b82f6" },
        { label: "Pending Approvals", value: pending,                   delta: pending > 0 ? "Requires action" : "All clear", color: "#ef4444" },
        { label: "Total Budget",      value: fmt(totalBud),             delta: `${projs.length} projects`,       color: "#10b981" },
      ]);

      // Build activity feed from audit logs
      const feed = logs.slice(0, 4).map(log => ({
        msg:  log.action + (log.user_name ? ` — ${log.user_name}` : ""),
        time: new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: log.action?.toLowerCase().includes("approv") ? "green"
            : log.action?.toLowerCase().includes("assign") ? "blue"
            : "yellow",
      }));
      setActivity(feed);

    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      await api.post("/seed");
      setSeedMsg("✓ Demo data generated successfully!");
      await loadData();
    } catch {
      setSeedMsg("✗ Seed failed — check your backend connection.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <PageShell title="Dashboard" subtitle="BuildSmart Construction Project Cloud" onNav={onNav} onLogout={onLogout} user={user}>

      {/* ADMIN: Generate Demo Data */}
      {user?.role === "ADMIN" && (
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <button
            className="btn-primary"
            onClick={handleSeed}
            disabled={seeding}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {seeding ? "Generating…" : "Generate Demo Data"}
          </button>
          {seedMsg && (
            <span style={{
              fontSize: 13, fontWeight: 500,
              color: seedMsg.startsWith("✓") ? "#10b981" : "#ef4444"
            }}>
              {seedMsg}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} className="bs-card stat-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Projects table + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 24 }}>
        <div className="bs-card">
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Recent Projects</div>
            <button className="btn-ghost" onClick={() => onNav("/projects")} style={{ fontSize: 12, padding: "5px 10px" }}>View all</button>
          </div>
          {projects.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
              No projects yet.{user?.role === "ADMIN" ? " Click "Generate Demo Data" above to populate." : ""}
            </div>
          ) : (
            <table className="bs-table">
              <thead>
                <tr><th>Project</th><th>Location</th><th>Budget</th><th>Status</th></tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
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

        <div className="bs-card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Recent Activity</div>
          {activity.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 8 }}>No activity recorded yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {activity.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                    background: a.type === "green" ? "#10b981" : a.type === "blue" ? "#3b82f6" : "#f59e0b"
                  }} />
                  <div>
                    <div style={{ fontSize: 13, color: "#0f172a", lineHeight: 1.5 }}>{a.msg}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default Dashboard;
