const db = require("../config/db");

exports.getReport = (req, res) => {

  const report = {};

  db.query(
    "SELECT COUNT(*) AS total FROM projects",
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Projects query failed"
        });
      }

      report.totalProjects = result?.[0]?.total || 0;

      db.query(
        `
        SELECT COUNT(*) AS completed
        FROM projects
        WHERE status='Completed'
        `,
        (err, result2) => {

          if (err) {
            console.log(err);
            report.completedProjects = 0;
          } else {
            report.completedProjects =
              result2?.[0]?.completed || 0;
          }

          db.query(
            `
            SELECT COUNT(*) AS pending
            FROM approvals
            WHERE status='Pending'
            `,
            (err, result3) => {

              if (err) {
                console.log(err);
                report.pendingApprovals = 0;
              } else {
                report.pendingApprovals =
                  result3?.[0]?.pending || 0;
              }

              db.query(
                `
                SELECT SUM(budget) AS totalBudget
                FROM projects
                `,
                (err, result4) => {

                  if (err) {
                    console.log(err);
                    report.totalBudget = 0;
                  } else {
                    report.totalBudget =
                      result4?.[0]?.totalBudget || 0;
                  }

                  res.json(report);

                }
              );
            }
          );
        }
      );
    }
  );
};