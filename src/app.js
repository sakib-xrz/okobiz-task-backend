const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const globalErrorHandler = require("./middleware/globalErrorHandler.js");
const router = require("./routes/routes.js");
const removeTrashFiles = require("./utils/removeTrashFiles.js");

const app = express();

// middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://nidmaker.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

cron.schedule("0 0 * * *", () => {
  try {
    removeTrashFiles();
  } catch (error) {
    console.log("Error while deleting trash files", error);
  }
});

// routes
app.use("/api/v1", router);

// global error handler middleware
app.use(globalErrorHandler);

// handle not found routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API not found",
      },
    ],
  });
  next();
});

module.exports = app;
