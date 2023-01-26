const express = require("express");
const mainRouter = express.Router();
const dataRouter = require("../routes/data");

mainRouter.use("/data", dataRouter);

mainRouter.get("/", (_, res) => {
  res.json({
    msg: "Welcome",
  });
});

module.exports = mainRouter;
