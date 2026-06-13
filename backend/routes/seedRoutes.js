const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const seedController =
require("../controllers/seedController");

router.post(
  "/",
  auth,
  authorize(["ADMIN"]),
  seedController.seedDemoData
);

module.exports = router;