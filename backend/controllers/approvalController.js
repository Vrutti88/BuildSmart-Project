const db = require("../config/db");

// GET APPROVALS

exports.getApprovals=(req,res)=>{

  db.query(

    "SELECT * FROM approvals",

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json(result);

    }

  );

};

// CREATE APPROVAL REQUEST

exports.createApproval=(req,res)=>{

  const {
    task_name
  } = req.body;

  const sql =

  `
  INSERT INTO approvals
  (
    task_name,
    status
  )
  VALUES(?,?)
  `;

  db.query(

    sql,

    [
      task_name,
      "Pending"
    ],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json({

        message:
        "Approval Created"

      });

    }

  );

};

// APPROVE

exports.approve=(req,res)=>{

  const {id}=req.params;

  db.query(

    `
    UPDATE approvals
    SET status='Approved'
    WHERE id=?
    `,

    [id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json({

        message:
        "Approved"

      });

    }

  );

};

// REJECT

exports.reject=(req,res)=>{

  const {id}=req.params;

  db.query(

    `
    UPDATE approvals
    SET status='Rejected'
    WHERE id=?
    `,

    [id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json({

        message:
        "Rejected"

      });

    }

  );

};