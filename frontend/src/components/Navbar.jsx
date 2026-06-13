function Navbar({ title, subtitle, onLogout, user }) {
  return (
    <div style={{
      height: 64, background: "#fff", borderBottom: "1px solid #f1f5f9",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", position: "sticky", top: 0, zIndex: 30
    }}>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#0f172a" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{subtitle}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Notification bell */}
        {/* <button style={{
          background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 8,
          width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{
            position: "absolute", top: 6, right: 6, width: 7, height: 7,
            background: "#f59e0b", borderRadius: "50%", border: "2px solid #fff"
          }}/>
        </button> */}

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg,#f59e0b,#ef4444)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#fff"
          }}>
            {(user?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{user?.name || "Admin"}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{user?.role || "Administrator"}</div>
          </div>
        </div>

        {/* Logout */}
        <button className="btn-ghost" onClick={onLogout} style={{ padding: "6px 12px", fontSize: 13 }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Navbar;
