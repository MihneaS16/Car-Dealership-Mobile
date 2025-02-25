const { cars } = require("./cars");
const mongoose = require("mongoose");
const Car = require("../models/car");

const dbUrl = "mongodb://127.0.0.1:27017/cars";

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Mongo connection open");
  })
  .catch((err) => {
    console.log("Mongo connection ERROR");
    console.log(e);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDb = async () => {
  try {
    await Car.deleteMany({});
    for (const car of cars) {
      const carObj = new Car(car);
      await carObj.save();
    }
  } catch (err) {
    console.error(err);
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
