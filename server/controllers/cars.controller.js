const Car = require("../models/car");

module.exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
    console.log("cars fetched");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get cars");
  }
};

module.exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.status(200).json(car);
    console.log("car fetched", car);
  } catch (err) {
    res.status(404).send("Car not found");
  }
};

module.exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
    console.log("car created", car);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate(id, { ...req.body }, { new: true });
    await car.save();
    res.status(200).json(car);
    console.log("car updated", car);
  } catch (err) {
    res.status(404).send("Car not found");
  }
};

module.exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCar = await Car.findByIdAndDelete(id);
    res.status(204).send();
    console.log("car deleted", deletedCar);
  } catch (err) {
    res.status(404).send("Car not found");
  }
};
