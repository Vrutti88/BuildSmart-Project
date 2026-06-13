const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const authorize =
require("../middleware/authorize");

const controller =
require("../controllers/projectController");

router.get(
  "/",
  auth,
  controller.getProjects
);

router.post(
  "/",
  auth,
  authorize(["ADMIN","MANAGER"]),
  controller.createProject
);

router.delete(
  "/:id",
  auth,
  authorize(["ADMIN"]),
  controller.deleteProject
);

module.exports = router;