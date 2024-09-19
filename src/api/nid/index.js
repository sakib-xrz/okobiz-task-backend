const express = require("express");
const authGuard = require("../../middleware/authGuard.js");

const router = express.Router();

const NidController = require("../../controllers/nid.controller.js");
const { upload } = require("../../utils/handelFile.js");

router
  .route("/")
  .post(authGuard(), upload.single("file"), NidController.createNid)
  .get(authGuard("ADMIN"), NidController.getNidsByUserId);

module.exports = router;
