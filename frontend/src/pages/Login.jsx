import { useState } from "react";
import api from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    }
    finally {
    setLoading(false);
  }
};

return (
  <div className="login-bg">
    {/* background grid pattern */}
    <div style={{
      position: "absolute", inset: 0, opacity: .04,
      backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
      backgroundSize: "40px 40px"
    }} />

    <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, padding: "0 20px" }}>
      {/* Logo block */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, background: "#f59e0b", borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#0f172a">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>
          BuildSmart
        </div>
        <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Construction Project Cloud</div>
      </div>

      {/* Card */}
      <div style={{
        background: "rgba(255,255,255,.04)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,.08)", borderRadius: 16,
        padding: "36px 32px"
      }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
          Sign in to your account
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28 }}>
          Enter your credentials to access the dashboard
        </p>

        {error && (
          <div style={{
            background: "#fee2e2", color: "#991b1b", borderRadius: 8,
            padding: "10px 14px", fontSize: 13, marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", display: "block", marginBottom: 6 }}>Email address</label>
            <input
              className="bs-input"
              type="email"
              placeholder="admin@buildsmart.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.1)", color: "#fff" }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", display: "block", marginBottom: 6 }}>Password</label>
            <input
              className="bs-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.1)", color: "#fff" }}
              required
            />
          </div>
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: 4 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(245,158,11,.06)", borderRadius: 8, border: "1px solid rgba(245,158,11,.15)" }}>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4, fontWeight: 600 }}>Demo credentials</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Any email + password → instant access</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#334155" }}>
        Deployed on AWS EC2 · RDS MySQL · S3 · CloudWatch
      </div>
    </div>
  </div>
);
}

export default Login;
