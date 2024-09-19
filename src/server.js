const app = require("./app.js");
const { config } = require("./config/config.js");
const connectDB = require("./config/db.js");

const port = config.port || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🎯 Server listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });

module.exports = app;
