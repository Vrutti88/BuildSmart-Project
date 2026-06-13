import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import api from "../services/api";

const MOCK = {
  cpu: 0,
  memory: 0,
  disk: 0,
  status: "Loading...",
  uptime: "N/A"
};

function Gauge({ label, value, color }) {
  const capped = Math.min(value || 0, 100);
  const warn = capped > 80;
  const col = warn ? "#ef4444" : color;
  return (
    <div className="bs-card" style={{ padding: 22 }}>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 10 }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 36, fontWeight: 700, color: col, lineHeight: 1 }}>{capped}</span>
        <span style={{ fontSize: 16, color: col, marginBottom: 3 }}>%</span>
      </div>
      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${capped}%`, background: col }} />
      </div>
      <div style={{ fontSize: 11, color: warn ? "#ef4444" : "#94a3b8", marginTop: 6 }}>
        {warn ? "⚠ High usage" : "Normal"}
      </div>
    </div>
  );
}

// const LOGS = [
//   { time:"10:41:02", level:"INFO",  msg:"Health check passed — EC2 instance i-0abc1234" },
//   { time:"10:40:15", level:"INFO",  msg:"RDS automated backup completed successfully" },
//   { time:"10:38:50", level:"WARN",  msg:"Memory usage crossed 60% threshold" },
//   { time:"10:35:22", level:"INFO",  msg:"S3 lifecycle policy applied — 12 objects archived" },
//   { time:"10:30:01", level:"INFO",  msg:"CloudWatch alarm: CPU normal (42%)" },
//   { time:"10:28:44", level:"ERROR", msg:"DB connection timeout — retried successfully" },
// ];

const LEVEL_COLOR = { INFO: "#10b981", WARN: "#f59e0b", ERROR: "#ef4444" };

function Monitoring({ onNav, onLogout, user }) {
  const [monitor, setMonitor] = useState(MOCK);
  const [tick, setTick] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {

    const loadMonitoring = async () => {

      try {

        const res =
          await api.get("/monitoring");

        const logRes =
          await api.get("/monitoring/logs");

        setLogs(logRes.data);

        if (res.data) {

          setMonitor({
            cpu: res.data.cpu || 0,
            memory: res.data.memory || 0,
            disk: res.data.disk || 0,
            status: res.data.status || "Healthy",
            uptime: res.data.uptime || "Running"
          });

        }

        setTick(prev => prev + 1);

      }
      catch (err) {

        console.error(err);

      }

    };

    loadMonitoring();

    const interval = setInterval(loadMonitoring, 60000);

    return () => clearInterval(interval);

  }, []);

  return (
    <PageShell title="Monitoring" subtitle="Live infrastructure health — refreshes every 3s" onNav={onNav} onLogout={onLogout} user={user}>
      {/* Gauges */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <Gauge label="CPU Usage" value={monitor.cpu} color="#3b82f6" />
        <Gauge label="Memory Usage" value={monitor.memory} color="#f59e0b" />
        <Gauge label="Disk Usage" value={monitor.disk} color="#10b981" />
        <div className="bs-card" style={{ padding: 22 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Server Status</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: monitor.status === "Healthy" ? "#10b981" : "#ef4444" }}>● {monitor.status}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>Uptime: {monitor.uptime || "14d 6h"}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Region: ap-south-1 (Mumbai)</div>
        </div>
      </div>

      {/* AWS services grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          ["CloudWatch", "Dashboard Active", "Alarms: 0 active", "#10b981", "Metrics collecting every 60s"],
          ["SNS Alerts", "Topic Configured", "Subscribers: 3", "#3b82f6", "Email + SMS alerts enabled"],
          ["Auto Scaling", "Policy Active", "Min:1 Max:4", "#f59e0b", "Scale-out at 70% CPU"],
          ["VPC", "10.0.0.0/16", "2 subnets active", "#10b981", "Public + private subnet"],
          ["Security Grp", "sg-0buildsmart", "Rules: 4 inbound", "#3b82f6", "SSH, HTTP, HTTPS, MySQL"],
          ["IAM", "3 users, 2 roles", "MFA enforced", "#10b981", "Least-privilege policy applied"],
        ].map(([s, v, sub, c, note]) => (
          <div key={s} className="bs-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s}</div>
              <span style={{ fontSize: 11, color: c, fontWeight: 600 }}>● Active</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>{v}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{sub}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{note}</div>
          </div>
        ))}
      </div>

      {/* System log */}
      <div className="bs-card">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>System Logs</div>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Live — tick {tick}</span>
        </div>
        <div style={{ padding: 4, fontFamily: "'Space Grotesk',monospace" }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: "flex",
                gap: 16,
                padding: "10px 20px",
                borderBottom: "1px solid #f8fafc"
              }}
            >

              <span
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  minWidth: 72
                }}
              >
                {
                  new Date(log.created_at)
                    .toLocaleTimeString()
                }
              </span>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#10b981",
                  minWidth: 40
                }}
              >
                INFO
              </span>

              <span
                style={{
                  fontSize: 13,
                  color: "#334155"
                }}
              >
                {log.action}
                {" - "}
                {log.user_name}
              </span>

            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default Monitoring;
