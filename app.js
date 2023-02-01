const express = require("express");
const morgan = require("morgan");
const { readdirSync } = require("fs");
require('dotenv').config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// all routes are immediately loaded when created
readdirSync("./routes").map(async (routeFile) => {
  app.use("/api/v1", await require(`./routes/${routeFile}`));
});

app.use("/", (req, res) => {
  res.status(200).json({
    status: "Active",
  });
});

module.exports = app
