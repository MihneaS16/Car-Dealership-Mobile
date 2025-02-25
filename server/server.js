const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const carRoutes = require("./routes/cars.routes");

const dbUrl = "mongodb://127.0.0.1:27017/cars";

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log(`Mongo connection open ${dbUrl}`);
  })
  .catch((err) => {
    console.log("Mongo connection ERROR");
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/cars", carRoutes);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = app;
