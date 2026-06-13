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
  controller.getMonitoring
);

router.get(
  "/logs",
  auth,
  monitoringController.getLogs
);

module.exports =
router;