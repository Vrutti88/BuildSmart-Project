import { useLocation } from "react-router-dom";

const NAV = [
  {
    to: "/", label: "Dashboard", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    )
  },
  {
    to: "/projects", label: "Projects", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    )
  },
  {
    to: "/tasks", label: "Tasks", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    )
  },
  {
    to: "/approvals", label: "Approvals", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  {
    to: "/analytics", label: "Analytics", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    to: "/reports", label: "Reports", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )
  },
  {
    to: "/monitoring", label: "Monitoring", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  },
];

function Sidebar({ onNav }) {
  const { pathname } = useLocation();
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return (
    <div style={{
      width: 240, background: "#0f172a", height: "100vh",
      position: "fixed", top: 0, left: 0, display: "flex", flexDirection: "column",
      padding: "0 12px 24px", zIndex: 40, overflowY: "auto"
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 8px 20px", borderBottom: "1px solid #1e293b", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: "#f59e0b", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>BuildSmart</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>Construction Cloud</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "#475569", padding: "12px 8px 6px" }}>
          Navigation
        </div>
        {
          NAV
            .filter(item => {

              if (user?.role === "ADMIN")
                return true;

              if (user?.role === "MANAGER")
                return [
                  "/",
                  "/projects",
                  "/tasks",
                  "/approvals",
                  "/reports",
                  "/analytics"
                ].includes(item.to);

              if (user?.role === "ENGINEER")
                return [
                  "/",
                  "/projects",
                  "/tasks"
                ].includes(item.to);

              return false;
            })
            .map(item => {
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              return (
                <div
                  key={item.to}
                  className={`nav-link${active ? " active" : ""}`}
                  onClick={() => onNav(item.to)}
                >
                  {item.icon}
                  {item.label}
                </div>
              );
            })}
      </nav>

      {/* AWS badge */}
      {/* <div style={{
        margin: "8px 0", padding: "12px", borderRadius: 10,
        background: "#1e293b", border: "1px solid #334155"
      }}>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>Infrastructure</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[["EC2", "Running"], ["RDS MySQL", "Connected"], ["CloudWatch", "Monitoring"]].map(([s, st]) => (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{s}</span>
              <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>● {st}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default Sidebar;
