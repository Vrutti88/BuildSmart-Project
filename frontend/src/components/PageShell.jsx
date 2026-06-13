import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function PageShell({ title, subtitle, onNav, onLogout, user, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar onNav={onNav} />
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar title={title} subtitle={subtitle} onLogout={onLogout} user={user} />
        <div style={{ padding: "28px 32px", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageShell;
