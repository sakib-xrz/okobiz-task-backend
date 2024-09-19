const express = require("express");
const AuthController = require("../../controllers/auth.controller.js");
const authGuard = require("../../middleware/authGuard.js");

const router = express.Router();

router.route("/register").post(AuthController.register);

router.route("/login").post(AuthController.login);

router.route("/me").get(authGuard(), AuthController.getMe);

module.exports = router;
