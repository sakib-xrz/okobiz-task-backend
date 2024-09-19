const express = require("express");

const authRoutes = require("../api/auth/index.js");
const userRoutes = require("../api/users/index.js");
const nidRoutes = require("../api/nid/index.js");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/nids", nidRoutes);

module.exports = router;
