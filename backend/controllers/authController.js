const db = require("../config/db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.register = async(req,res)=>{

    try{
  
      const {
        name,
        email,
        password,
        role
      } = req.body;
  
      const hashedPassword =
        await bcrypt.hash(password,10);
  
      const sql =
  
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role
      )
      VALUES(?,?,?,?)
      `;
  
      db.query(
        sql,
        [
          name,
          email,
          hashedPassword,
          role
        ],
        (err,result)=>{
  
          if(err){
  
            return res.status(500).json(err);
  
          }
  
          res.status(201).json({
  
            message:
            "User Registered Successfully"
  
          });
  
        }
      );
  
    }
    catch(error){
  
      res.status(500).json(error);
  
    }
  
  };



  exports.login = (req,res)=>{

    const {
      email,
      password
    } = req.body;
  
    const sql =
  
    `
    SELECT *
    FROM users
    WHERE email=?
    `;
  
    db.query(
  
      sql,
  
      [email],
  
      async(err,result)=>{
  
        if(err){
  
          return res.status(500).json(err);
  
        }
  
        if(result.length===0){
  
          return res.status(404).json({
  
            message:"User Not Found"
  
          });
  
        }
  
        const user = result[0];
  
        const match =
          await bcrypt.compare(
            password,
            user.password
          );
  
        if(!match){
  
          return res.status(401).json({
  
            message:"Invalid Password"
  
          });
  
        }
  
        const token = jwt.sign(
  
          {
            id:user.id,
            role:user.role
          },
  
          process.env.JWT_SECRET,
  
          {
            expiresIn:"1d"
          }
  
        );
  
        res.json({
  
          token,
  
          user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role
          }
  
        });
  
      }
  
    );
  
  };