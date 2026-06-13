import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, LineElement, PointElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Title, Tooltip, Legend, Filler);

const opts = { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" } } } };
const optsPie = { responsive: true, plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 12 } } } } };
const optsLine = { ...opts, plugins: { legend: { display: false } } };

function Analytics({ onNav, onLogout, user }) {
  const [projects,  setProjects]  = useState([]);
  const [tasks,     setTasks]     = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([api.get("/projects"), api.get("/tasks"), api.get("/approvals")])
      .then(([pRes, tRes, aRes]) => {
        setProjects(pRes.data  || []);
        setTasks(tRes.data     || []);
        setApprovals(aRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Derived KPIs ──────────────────────────────────────
  const totalBudget  = projects.reduce((s, p) => s + Number(p.budget || 0), 0);
  const totalComp    = projects.filter(p => p.status === "Completed").length;
  const totalActive  = projects.filter(p => p.status === "Active").length;
  const tasksDone    = tasks.filter(t => t.status === "Completed").length;
  const tasksTotal   = tasks.length || 1;
  const taskCompPct  = Math.round((tasksDone / tasksTotal) * 100);
  const onTimePct    = projects.length
    ? Math.round(((projects.length - projects.filter(p => p.status === "Delayed").length) / projects.length) * 100)
    : 0;

  // ── Bar chart: budget per project (top 6) ────────────
  const top6 = projects.slice(0, 6);
  const barData = {
    labels: top6.map(p => p.project_name?.split(" ").slice(0, 2).join(" ") || "Project"),
    datasets: [{
      label: "Budget (₹)",
      data: top6.map(p => Math.round(Number(p.budget) / 100000)), // in lakhs
      backgroundColor: "#f59e0b",
      borderRadius: 6,
    }]
  };

  // ── Pie chart: task status breakdown ─────────────────
  const completed  = tasks.filter(t => t.status === "Completed").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const pending    = tasks.filter(t => t.status === "Pending").length;
  const pieData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [{ data: [completed, inProgress, pending], backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"], borderWidth: 0, hoverOffset: 4 }]
  };

  // ── Line chart: approvals over time (by created_at month) ─
  const monthMap = {};
  approvals.forEach(a => {
    const d = a.created_at ? new Date(a.created_at) : null;
    if (!d) return;
    const key = d.toLocaleString("en-IN", { month: "short" });
    monthMap[key] = (monthMap[key] || 0) + 1;
  });
  const monthLabels = Object.keys(monthMap);
  const lineData = {
    labels: monthLabels.length ? monthLabels : ["No data"],
    datasets: [{
      label: "Approvals",
      data: monthLabels.length ? Object.values(monthMap) : [0],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,.1)",
      fill: true,
      tension: .4,
      pointRadius: 4,
      pointBackgroundColor: "#3b82f6"
    }]
  };

  const fmt = v => {
    if (v >= 10000000) return "₹" + (v / 10000000).toFixed(1) + "Cr";
    if (v >= 100000)   return "₹" + (v / 100000).toFixed(1) + "L";
    return "₹" + v.toLocaleString("en-IN");
  };

  return (
    <PageShell title="Analytics" subtitle="Project performance and KPIs" onNav={onNav} onLogout={onLogout} user={user}>
      {loading ? (
        <div style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading analytics…</div>
      ) : (
        <>
          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            {[
              ["Total Budget",      fmt(totalBudget),        "#f59e0b"],
              ["On-time Delivery",  `${onTimePct}%`,         "#10b981"],
              ["Task Completion",   `${taskCompPct}%`,       "#3b82f6"],
              ["Active Projects",   totalActive,             "#0f172a"],
            ].map(([l, v, c]) => (
              <div key={l} className="bs-card" style={{ padding: 18 }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{l}</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700, color: c }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="bs-card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Budget by Project (₹ Lakhs)</div>
              {projects.length === 0
                ? <div style={{ color: "#94a3b8", fontSize: 13 }}>No project data yet.</div>
                : <Bar data={barData} options={opts} />}
            </div>
            <div className="bs-card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Task Status Distribution</div>
              {tasks.length === 0
                ? <div style={{ color: "#94a3b8", fontSize: 13 }}>No task data yet.</div>
                : <Pie data={pieData} options={optsPie} />}
            </div>
          </div>

          {/* Charts row 2 */}
          <div className="bs-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Approval Requests Over Time</div>
            {approvals.length === 0
              ? <div style={{ color: "#94a3b8", fontSize: 13 }}>No approval data yet.</div>
              : <Line data={lineData} options={optsLine} />}
          </div>
        </>
      )}
    </PageShell>
  );
}

export default Analytics;
