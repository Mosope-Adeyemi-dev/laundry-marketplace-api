const express = require("express");
const morgan = require("morgan");
const { readdirSync } = require("fs");
const cors = require("cors")
require('dotenv').config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

// all routes are immediately loaded when created
readdirSync("./routes").map(async (routeFile) => {
  app.use("/api/v1", await require(`./routes/${routeFile}`));
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
  });
});

module.exports = app
