const express = require("express");
const UserController = require("../../controllers/user.controller.js");
const authGuard = require("../../middleware/authGuard.js");

const router = express.Router();

router.route("/").get(authGuard("ADMIN"), UserController.getAllUsers);
router
  .route("/:id/status")
  .patch(authGuard("ADMIN"), UserController.updateUserStatus);

module.exports = router;
