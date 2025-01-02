const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  category: [
    {
      type: String,
      enum: [
        "Men",
        "Women",
        "Kids",
        "Electronics",
        "Home",
        "Sports",
        "Books",
        "Beauty",
        "Health",
        "Toys",
        "Food",
        "Pets",
        "Travel",
        "Other"
      ]
    }
  ],         
},
{
  timestamps: true 
});

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;
