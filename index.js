const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");
const Product = require("./models/product.models");
const Wishlist = require("./models/wishlist.models");

app.use(express.json());

initializeDatabase();

// const newProducts = {
//   title: "Sunset Resort",
//   price: "Resort",
//   description: "12 Main Road, Anytown",
//   rating: 4.0,
//   category: [],
//   productImageURl: "https://sunset-example.com",//   
// };

async function createProduct(newProduct) {
  try {
    const product = new Product(newProduct);
    const saveProduct = await product.save();
    console.log("New Hotel Data", saveProduct);
  } catch (error) {
    throw error;
  }
}


app.post("/products", async (req, res) => {
try {
  const savedProducts = await createProduct(req.body);
  res.status(201).json({message: "Product Added successfully.", product: savedProducts})
} catch (error) {
  res.status(500).json({error: "Failed to add Product."})
}
})

async function readAllProducts() {
  try {
    const readProducts = await Product.find();
    return readProducts;
  } catch (error) {
    throw error;
  }
}

app.get("/products", async (req, res) => {
  try {
    const products = await readAllProducts();
    if (products.length != 0) {
      res.json(products);
    } else {
      res.status(404).json({ error: "No products found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// readAllProducts();

async function readProductById(productId) {
  try {
    const productById = await Product.findById(productId);
    return productById;
  } catch (error) {
    console.log(error);
  }
}

app.get("/products/:productId", async (req, res) => {
  try {
    const productById = await readProductById(req.params.productId);
    if (productById) {
      res.json(productById);
    } else {
      res.status(404).json({ error: "No product found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product." });
  }
});

// async function readByCateogry() {
//   try {
//     const productByCategory = await Product.find();
//     return productByCategory;
//   } catch (error) {
//     throw error;
//   }
// }

// async function getProductsByCategory(category) {
//   try {
//     // Query the Product model to find products matching the category
//     const products = await Product.find({ category });

//     return products;
//   } catch (error) {
//     throw error; // Rethrow error so it can be caught by the calling function
//   }
// }

async function getProductsByCategory() {
  try {
    // Fetch all products (you could apply additional filters if necessary)
    const products = await Product.find(); // This will return all products
    
    // Extract distinct categories using a Set to filter duplicates
    const categories = new Set(products.map(product => product.category));

    // Convert the Set to an array and return
    return Array.from(categories);
  } catch (error) {
    throw error; // Rethrow error to be handled by the route
  }
}

app.get('/categories', async (req, res) => {
  try {
    // Get distinct categories from the database
    const categories = await getProductsByCategory();

    if (categories.length > 0) {
      // If categories exist, return them in the response
      return res.status(200).json({ categories });
    } else {
      // If no categories are found
      return res.status(404).json({ error: 'No categories found.' });
    }
  } catch (error) {
    // Handle any errors (e.g., database issues)
    return res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// async function readCategoriesById(categoryId) {
//   try {
//     const categoryById = await Product.findOne({ category: categoryId });
//     return categoryById;
//   } catch (error) {
//     console.log(error);
//   }
// }

// app.get("/categories/:categoryId", async (req, res) => {
//   try {
//     const categoryById = await readCategoriesById(req.params.categoryId);
//     if (categoryById) {
//       res.json(categoryById);
//     } else {
//       res.status(404).json({ error: "No product found." });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch product." });
//   }
// });

async function getCategoryData(categoryId) {
  try {
    // Fetch products for the specific category (categoryId is a category name)
    const categoryData = await Product.find({ category: categoryId });

    if (categoryData.length === 0) {
      throw new Error('Category not found or no products available for this category.');
    }

    return categoryData;
  } catch (error) {
    throw error; // Rethrow the error to be handled by the route
  }
}

app.get('/categories/:categoryId', async (req, res) => {
  const { categoryId } = req.params; // Get categoryId from the URL parameter

  try {
    // Fetch category data based on the categoryId
    const categoryData = await getCategoryData(categoryId);

    // Return the category data in the response
    return res.status(200).json({ data: { category: categoryData } });
  } catch (error) {
    // Handle errors: no products found, category not found, etc.
    if (error.message === 'Category not found or no products available for this category.') {
      return res.status(404).json({ error: error.message });
    }

    // Internal server error
    return res.status(500).json({ error: 'Failed to fetch category data.' });
  }
});


async function readWishlist() {
  try {
    const wishlist = await Wishlist.findOne().populate("items.productId");
    return wishlist;
  } catch (error) {
    throw error;
  }
}

// Assuming Express setup is done
app.get("/wishlist", async (req, res) => {
  try {
    const wishlist = await readWishlist();  // Use the separate function
    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found." });
    }
    res.json(wishlist); // Send the wishlist as JSON
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Failed to fetch wishlist." });
  }
});


async function addToWishlist(productId) {
  try {
    // Find the first wishlist (or create one)
    let wishlist = await Wishlist.findOne();

    if (!wishlist) {
      // If no wishlist exists, create a new one
      wishlist = new Wishlist({
        items: [{ productId }],
      });
    } else {
      // If wishlist exists, add the product to the items
      wishlist.items.push({ productId });
    }

    // Save the wishlist to the database
    const savedWishlist = await wishlist.save();

    // Return the saved wishlist object for confirmation
    console.log("Updated Wishlist:", savedWishlist);
    return savedWishlist;

  } catch (error) {
    console.error("Error adding product to wishlist:", error.message);
    throw new Error("Failed to add product to wishlist.");
  }
}


app.post("/wishlist", async (req, res) => {
  try {
    const { productId } = req.body;  // Get productId from the request body

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const updatedWishlist = await addToWishlist(productId);

    res.status(201).json({
      message: "Product added to wishlist successfully!",
      wishlist: updatedWishlist,
    });

  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to add product to wishlist." });
  }
});

async function removeFromWishlist(itemId) {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      {},
      { $pull: { items: { _id: itemId } } }, // Remove item with specified _id from items array
      { new: true } // Return the updated document
    ).populate("items.productId");

    if (!wishlist) {
      throw new Error("Wishlist not found.");
    }

    console.log("Updated Wishlist after deletion:", wishlist);
    return wishlist;
  } catch (error) {
    console.error("Error removing item from wishlist:", error.message);
    throw error;
  }
}

app.delete("/wishlist/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const updatedWishlist = await removeFromWishlist(itemId);
    res.status(200).json({
      message: "Item removed from wishlist successfully!",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    if (error.message === "Wishlist not found.") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to remove item from wishlist." });
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
