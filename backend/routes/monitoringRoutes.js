const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/auth");

const controller =
require("../controllers/monitoringController");

router.get(
  "/",
  auth,
  controller.getMonitoring
);

router.get(
  "/logs",
  auth,
  controller.getLogs
);

module.exports =
router;