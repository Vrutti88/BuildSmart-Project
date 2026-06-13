const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth");

const authorize =
require("../middleware/authorize");

const controller =
require("../controllers/approvalController");

router.get(
  "/",
  auth,
  controller.getApprovals
);

router.post(
  "/",
  auth,
  controller.createApproval
);

router.put(
  "/approve/:id",
  auth,
  authorize(["ADMIN","MANAGER"]),
  controller.approve
);

router.put(
  "/reject/:id",
  auth,
  authorize(["ADMIN","MANAGER"]),
  controller.reject
);

module.exports = router;