const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      landmark: {
        type: String,
        required: true
      },
      city: {
        type: String,
      },
      state: {
        type:String,
        required: true
      }
}, {
    timestamps: true,
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;