const express = require("express");
const authGuard = require("../../middleware/authGuard.js");

const router = express.Router();

const NidController = require("../../controllers/nid.controller.js");
const { upload } = require("../../utils/handelFile.js");

router
  .route("/")
  .post(authGuard(), upload.single("file"), NidController.createNid);

router
  .route("/user/userId")
  .get(authGuard("ADMIN"), NidController.getNidsByUserId);

router.route("/:key").get(authGuard(), NidController.getNidByKey);

module.exports = router;
