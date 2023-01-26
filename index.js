require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const server = express();
const mainRouter = require("./src/routes/main");

server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
server.use(mainRouter);
server.listen(8080, () => {
  console.log("Server is running at port 8080");
});
