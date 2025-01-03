const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  category: [
    {
      type: String,
      enum: [
        "men",
        "women",
        "kids",
        "electronics",
        "home",
        "sports",
        "books",
        "beauty",
        "health",
        "toys",
        "food",
        "pets",
        "travel",
        "other"
      ]
    }
  ],         
},
{
  timestamps: true 
});

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;
