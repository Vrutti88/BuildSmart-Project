const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/auth");

const controller =
require("../controllers/reportController");

router.get(
  "/",
  auth,
  controller.getReport
);

module.exports =
router;