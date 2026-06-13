const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const authorize =
require("../middleware/authorize");

const controller =
require("../controllers/taskController");

router.get(
  "/",
  auth,
  controller.getTasks
);

router.post(
  "/",
  auth,
  authorize(["ADMIN","MANAGER"]),
  controller.createTask
);

router.delete(
  "/:id",
  auth,
  authorize(["ADMIN"]),
  controller.deleteTask
);

module.exports = router;