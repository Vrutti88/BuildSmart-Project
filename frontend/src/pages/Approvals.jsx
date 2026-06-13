import { useState, useEffect } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

const priorityBadge = { High: "badge-red", Medium: "badge-yellow", Low: "badge-gray" };

// Approvals table has: id, task_name, status, created_at
// The backend seed also stores requester & priority only in the task_name string,
// so we derive priority from position for seeded data and default otherwise.
function derivePriority(item, index) {
  const name = (item.task_name || "").toLowerCase();
  if (name.includes("budget") || name.includes("purchase") || name.includes("foundation")) return "High";
  if (name.includes("electrical") || name.includes("safety") || name.includes("drainage")) return "Medium";
  return "Low";
}

function Approvals({ onNav, onLogout, user }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = () => {
    setLoading(true);
    api.get("/approvals")
      .then(r => setItems(r.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApprovals(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/approvals/approve/${id}`);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: "Approved" } : i));
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/approvals/reject/${id}`);
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: "Rejected" } : i));
    } catch (err) { console.error(err); }
  };

  const handleReset = async (id) => {
    // optimistic — backend has no reset endpoint, so just update local state
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "Pending" } : i));
  };

  const counts = {
    pending:  items.filter(i => i.status === "Pending").length,
    approved: items.filter(i => i.status === "Approved").length,
    rejected: items.filter(i => i.status === "Rejected").length,
  };

  return (
    <PageShell title="Approvals" subtitle="Review and action pending requests" onNav={onNav} onLogout={onLogout} user={user}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[["Awaiting Action", counts.pending, "#f59e0b"], ["Approved", counts.approved, "#10b981"], ["Rejected", counts.rejected, "#ef4444"]].map(([l, v, c]) => (
          <div key={l} className="bs-card stat-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{l}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bs-card">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", fontWeight: 600, fontSize: 15 }}>
          Approval Queue
        </div>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading approvals…</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            No approval requests yet. {user?.role === "ADMIN" ? "Use 'Generate Demo Data' on the Dashboard." : ""}
          </div>
        ) : (
          <table className="bs-table">
            <thead>
              <tr><th>Request</th><th>Date</th><th>Priority</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const priority = derivePriority(item, idx);
                const dateStr  = item.created_at
                  ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                  : "—";
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500, maxWidth: 280 }}>{item.task_name}</td>
                    <td style={{ color: "#94a3b8", fontSize: 12 }}>{dateStr}</td>
                    <td><span className={`badge ${priorityBadge[priority]}`}>{priority}</span></td>
                    <td>
                      {item.status === "Pending"  && <span className="badge badge-yellow">Pending</span>}
                      {item.status === "Approved" && <span className="badge badge-green">Approved</span>}
                      {item.status === "Rejected" && <span className="badge badge-red">Rejected</span>}
                    </td>
                    <td>
                      {item.status === "Pending" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn-approve" onClick={() => handleApprove(item.id)}>Approve</button>
                          <button className="btn-reject"  onClick={() => handleReject(item.id)}>Reject</button>
                        </div>
                      ) : (
                        <button className="btn-ghost" onClick={() => handleReset(item.id)} style={{ fontSize: 12, padding: "5px 10px" }}>
                          Reset
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </PageShell>
  );
}

export default Approvals;
