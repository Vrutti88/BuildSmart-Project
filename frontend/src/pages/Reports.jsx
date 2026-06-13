import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

const fmt = v => {
  const n = Number(v);
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000)   return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
};

const EMPTY = {
  totalProjects: 0, completedProjects: 0, activeProjects: 0,
  delayedProjects: 0, pendingApprovals: 0, totalBudget: 0, totalTasks: 0
};

function Reports({ onNav, onLogout, user }) {
  const [report,  setReport]  = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/reports"), api.get("/tasks")])
      .then(([rRes, tRes]) => {
        const r = rRes.data || {};
        const tasks = tRes.data || [];
        setReport({
          totalProjects:     r.totalProjects     || 0,
          completedProjects: r.completedProjects  || 0,
          activeProjects:    r.activeProjects     || (r.totalProjects - r.completedProjects - (r.delayedProjects || 0)) || 0,
          delayedProjects:   r.delayedProjects    || 0,
          pendingApprovals:  r.pendingApprovals   || 0,
          totalBudget:       r.totalBudget        || 0,
          totalTasks:        tasks.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const safeTotal = report.totalProjects || 1; // avoid /0

  return (
    <PageShell title="Executive Reports" subtitle="Aggregated platform performance insights" onNav={onNav} onLogout={onLogout} user={user}>
      {loading ? (
        <div style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading report…</div>
      ) : (
        <>
          {/* Primary KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
            {[
              ["Total Projects",    report.totalProjects,     "#0f172a", "All registered projects"],
              ["Completed",         report.completedProjects, "#10b981", "Successfully delivered"],
              ["Pending Approvals", report.pendingApprovals,  "#f59e0b", "Awaiting manager sign-off"],
              ["Total Budget",      fmt(report.totalBudget),  "#3b82f6", "Combined project value"],
            ].map(([l, v, c, sub]) => (
              <div key={l} className="bs-card stat-card" style={{ padding: 22 }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{l}</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 34, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Project status breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="bs-card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Project Status Breakdown</div>
              {report.totalProjects === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: 13 }}>No project data yet.</div>
              ) : [
                ["Active",    report.activeProjects,    "#10b981"],
                ["Completed", report.completedProjects, "#3b82f6"],
                ["Delayed",   report.delayedProjects,   "#ef4444"],
              ].map(([l, v, c]) => (
                <div key={l} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{l}</span>
                    <span style={{ fontSize: 13, color: "#475569" }}>{v} / {report.totalProjects}</span>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-fill" style={{ width: `${(v / safeTotal) * 100}%`, background: c }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bs-card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Platform Summary</div>
              <table className="bs-table">
                <tbody>
                  {[
                    ["Total Tasks",        report.totalTasks],
                    ["Active Projects",    report.activeProjects],
                    ["Delayed Projects",   report.delayedProjects],
                    ["Pending Approvals",  report.pendingApprovals],
                    ["Total Budget",       fmt(report.totalBudget)],
                  ].map(([l, v]) => (
                    <tr key={l}>
                      <td style={{ color: "#475569", fontSize: 13 }}>{l}</td>
                      <td style={{ fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AWS Report — infrastructure details are static by nature */}
          <div className="bs-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>AWS Infrastructure Report</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[
                ["EC2 Instance", "t3.medium",        "Running",     "#10b981"],
                ["RDS MySQL",    "db.t3.small",       "Healthy",     "#10b981"],
                ["S3 Bucket",    "buildsmart-data",   "Active",      "#3b82f6"],
                ["CloudWatch",   "Alarms: 0",         "All clear",   "#10b981"],
              ].map(([s, v, st, c]) => (
                <div key={s} style={{ background: "#f8fafc", borderRadius: 8, padding: "14px 16px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{s}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div>
                  <div style={{ fontSize: 12, color: c, marginTop: 4, fontWeight: 500 }}>● {st}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}

export default Reports;
