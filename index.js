const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8000;
const usersRoutes = require("./routes/v1/users.routes");

// for router middleware connection:
app.use("/api/v1/user", usersRoutes);
// for all global middleware:
app.use([morgan("dev"), express.json(), cors()]);

// this is the health check route
// we know health is wealth and also the software has health and i check this:
app.get("/health", (req, res) => {
  // check the server error:
  //   throw new Error();
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  res.status(200).json(healthcheck);
});

// global error handler:
app.use((req, res, next) => {
  const err = new Error("pages not found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).send(`<h1>${err.message}</h1>`);
  }
  //   for server error:
  return res.status(500).json({ message: "Server error occured" });
});

app.listen(port, () => {
  console.log(`Express server listening on port : ${port}`);
});
