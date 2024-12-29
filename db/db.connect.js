const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB_URI;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected Successfully");
    })
    .catch(error => console.log("Error connecting to Database", error));
};


module.exports = {initializeDatabase}