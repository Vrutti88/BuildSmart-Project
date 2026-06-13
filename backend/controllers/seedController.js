const db = require("../config/db");

exports.seedDemoData = async (req, res) => {
    try {

        db.query(`
      INSERT INTO projects
        (project_name, location, budget)
        VALUES
        ('Mumbai Metro Extension', 'Mumbai', 80000000),
        ('Coastal Highway NH-66', 'Pune', 55000000),
        ('Commercial Tower - BKC', 'Mumbai', 34000000),
        ('Residential Township', 'Nagpur', 22000000),
        ('Airport Runway Widening', 'Nashik', 57000000),
        ('Smart City Road Network', 'Ahmedabad', 41000000),
        ('Industrial Park Development', 'Surat', 62000000),
        ('Hydroelectric Dam Upgrade', 'Nashik', 48000000),
        ('IT Park Expansion', 'Pune', 36000000),
        ('River Bridge Construction', 'Kolhapur', 28000000),
        ('Green Housing Project', 'Aurangabad', 24000000),
        ('Solar Power Plant', 'Jodhpur', 73000000);
    `);

        db.query(`
      INSERT INTO tasks
        (task_name, assigned_to, status)
        VALUES
        ('Excavation - Zone A', 'Rahul Sharma', 'Completed'),
        ('Foundation Concrete Pour', 'Priya Singh', 'In Progress'),
        ('Electrical Layout Plan', 'Amit Patel', 'Pending'),
        ('Safety Inspection Round', 'Neha Verma', 'Pending'),
        ('Material Procurement', 'Rohan Mehta', 'In Progress'),

        ('Steel Reinforcement Work', 'Karan Joshi', 'Completed'),
        ('Drainage System Setup', 'Pooja Shah', 'Completed'),
        ('Bridge Pillar Inspection', 'Ankit Verma', 'In Progress'),
        ('Site Survey Phase 2', 'Rakesh Nair', 'Completed'),
        ('Concrete Quality Audit', 'Amit Patel', 'Completed'),

        ('Tunnel Ventilation Design', 'Rahul Sharma', 'Pending'),
        ('Electrical Cable Installation', 'Priya Singh', 'In Progress'),
        ('Water Pipeline Inspection', 'Neha Verma', 'Completed'),
        ('Safety Training Session', 'Rohan Mehta', 'Completed'),
        ('Equipment Maintenance', 'Karan Joshi', 'Pending'),

        ('Road Marking Work', 'Pooja Shah', 'Completed'),
        ('Structural Load Testing', 'Ankit Verma', 'In Progress'),
        ('HVAC Installation', 'Rakesh Nair', 'Completed'),
        ('Solar Panel Mounting', 'Rahul Sharma', 'Pending'),
        ('Final Site Handover', 'Priya Singh', 'In Progress');
    `);

        db.query(`
      INSERT INTO approvals
        (task_name, status)
        VALUES
        ('Foundation Concrete Pour - Mumbai Metro', 'Pending'),
        ('Electrical Panel Installation - BKC Tower', 'Pending'),
        ('Purchase Order - Steel Rebar ₹12L', 'Pending'),
        ('Labour Overtime Approval - NH66', 'Pending'),
        ('Safety Compliance Audit', 'Pending'),
        ('Drainage Design Review', 'Pending'),
        ('Final Budget Approval', 'Pending');
    `);

        db.query(`
      INSERT INTO reports
        (report_name)
        VALUES
        ('Weekly Progress Report'),
        ('Monthly Budget Analysis'),
        ('Construction KPI Report'),
        ('Resource Utilization Report'),
        ('Project Status Summary'),
        ('Executive Dashboard Report');
    `);

        db.query(`
        INSERT INTO audit_logs
        (action, user_name)
        VALUES
        ('Created Mumbai Metro Extension Project', 'Admin'),
        ('Approved Foundation Concrete Pour', 'Manager'),
        ('Assigned Task to Rahul Sharma', 'Admin'),
        ('Generated Budget Report', 'Manager'),
        ('Updated Project Status', 'Engineer'),
        ('Uploaded Safety Inspection Report', 'Engineer'),
        ('Approved Procurement Request', 'Manager'),
        ('Generated Analytics Dashboard', 'Admin'),
        ('Created Coastal Highway Project', 'Admin'),
        ('Completed Site Survey Phase 2', 'Engineer');
      `);

        res.json({
            message: "Demo data created successfully"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};