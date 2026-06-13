const db = require("../config/db");

// GET TASKS

exports.getTasks = (req,res)=>{

  db.query(

    "SELECT * FROM tasks",

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json(result);

    }

  );

};

// CREATE TASK

exports.createTask = (req,res)=>{

  const {
    task_name,
    assigned_to,
    status
  } = req.body;

  const sql =

  `
  INSERT INTO tasks
  (
    task_name,
    assigned_to,
    status
  )
  VALUES(?,?,?)
  `;

  db.query(

    sql,

    [
      task_name,
      assigned_to,
      status || "Pending"
    ],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json({
        message:"Task Created"
      });

    }

  );

};

// DELETE TASK

exports.deleteTask=(req,res)=>{

  const {id}=req.params;

  db.query(

    "DELETE FROM tasks WHERE id=?",

    [id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json({
        message:"Task Deleted"
      });

    }

  );

};