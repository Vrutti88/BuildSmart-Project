const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const reportRoutes = require("./routes/reportRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const seedRoutes = require("./routes/seedRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

  res.json({
    project: "BuildSmart Construction Project Cloud",
    status: "Running"
  });

});

/*
==================================
AUTHENTICATION
==================================
*/

app.use("/api/auth", authRoutes);

/*
==================================
PROJECT MANAGEMENT
==================================
*/

app.use("/api/projects", projectRoutes);

/*
==================================
TASK MANAGEMENT
==================================
*/

app.use("/api/tasks", taskRoutes);

/*
==================================
APPROVAL WORKFLOW
==================================
*/

app.use("/api/approvals", approvalRoutes);

/*
==================================
EXECUTIVE REPORTING
==================================
*/

app.use("/api/reports", reportRoutes);

/*
==================================
MONITORING DASHBOARD
==================================
*/

app.use("/api/monitoring", monitoringRoutes);

app.use("/api/seed", seedRoutes);

module.exports = app;