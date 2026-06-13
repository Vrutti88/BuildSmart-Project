import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Approvals from "./pages/Approvals";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Monitoring from "./pages/Monitoring";
import RoleRoute from "./components/RoleRoute";

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  const token = localStorage.getItem("token");
  const isAuth = !!token;

  const handleLogin = (u) => {

    setUser(u);

    if (u.role === "ADMIN") {
      navigate("/");
    }

    else if (u.role === "MANAGER") {
      navigate("/projects");
    }

    else if (u.role === "ENGINEER") {
      navigate("/tasks");
    }

  };
  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    setUser(null); navigate("/login");
  };

  if (!isAuth) return <Login onLogin={handleLogin} />;

  const shared = { onNav: navigate, onLogout: handleLogout, user };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/" element={<Dashboard  {...shared} />} />
      <Route path="/projects" element={<Projects   {...shared} />} />
      <Route path="/tasks" element={<Tasks      {...shared} />} />
      <Route
        path="/approvals"
        element={
          <RoleRoute roles={["ADMIN", "MANAGER"]}>
            <Approvals {...shared} />
          </RoleRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <RoleRoute roles={["ADMIN", "MANAGER"]}>
            <Reports {...shared} />
          </RoleRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <RoleRoute roles={["ADMIN"]}>
            <Analytics {...shared} />
          </RoleRoute>
        }
      />

      <Route
        path="/monitoring"
        element={
          <RoleRoute roles={["ADMIN"]}>
            <Monitoring {...shared} />
          </RoleRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
