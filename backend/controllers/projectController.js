const db = require("../config/db");

// GET ALL PROJECTS

exports.getProjects = (req,res)=>{

  const sql = "SELECT * FROM projects";

  db.query(sql,(err,result)=>{

    if(err){

      return res.status(500).json(err);

    }

    res.json(result);

  });

};

// CREATE PROJECT

exports.createProject = (req,res)=>{

  const {
    project_name,
    location,
    budget
  } = req.body;

  const sql =

  `
  INSERT INTO projects
  (
    project_name,
    location,
    budget
  )
  VALUES(?,?,?)
  `;

  db.query(

    sql,

    [
      project_name,
      location,
      budget
    ],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json({
        message:"Project Created"
      });

    }

  );

};

// DELETE PROJECT

exports.deleteProject=(req,res)=>{

  const {id}=req.params;

  db.query(

    "DELETE FROM projects WHERE id=?",

    [id],

    (err,result)=>{

      if(err){

        return res.status(500).json(err);

      }

      res.json({
        message:"Project Deleted"
      });

    }

  );

};