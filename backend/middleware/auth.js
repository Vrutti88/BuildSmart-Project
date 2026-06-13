const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied"
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();

  } catch (error) {

    console.log("JWT ERROR:", error.message);

    return res.status(403).json({
      message: "Invalid Token"
    });

  }

};

module.exports = auth;