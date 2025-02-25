const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      description: {
        type: String,        
      },
      category: {
        type: String,
        required: true
      },
      productImageURL: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        min: 1,
        max: 4,
        required: true,
      },
      discount: {
        type: Number,
        required:true
      }

},
{
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;




