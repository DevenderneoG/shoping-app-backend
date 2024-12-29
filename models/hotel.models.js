const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: [
    {
      type: String,
      enum: ["Budget", "Mid-Range", "Luxury", "Boutique", "Resort", "Other"]
    }
  ],
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: [
    {
      type: String
    }
  ],
  website: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  checkInTime: {
    type: String,
    required: true,
  },
  checkOutTime: {
    type: String,
    required: true,
  },
  amenities: [
    {
      type: String
    }
  ],
  priceRange: {
    type: String
  },
  reservationsNeeded: {
    type: Boolean,
    default: false,
  },
  isParkingAvailable: {
    type: Boolean,
    default: false,
  },
  isWifiAvailable: {
    type: Boolean,
    default: false
  },
  isPoolAvailable: {
    type: Boolean,
    default: false
  },
  isSpaAvailable: {
    type: Boolean,
    default: false
  },
  isRestaurantAvailable: {
    type: Boolean,
    default: false,
  },
  photos: [
    {
      type: String
    }
  ],        
},
{
  timestamps: true
}
);

const Hotels = mongoose.model("Hotels", hotelSchema);

module.exports = Hotels;