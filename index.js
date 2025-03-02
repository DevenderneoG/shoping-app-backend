const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");
const Product = require("./models/product.models");
const Wishlist = require("./models/wishlist.models");
const Cart = require("./models/cart.models");

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
    res
      .status(201)
      .json({ message: "Product Added successfully.", product: savedProducts });
  } catch (error) {
    res.status(500).json({ error: "Failed to add Product." });
  }
});

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
    const categories = new Set(products.map((product) => product.category));

    // Convert the Set to an array and return
    return Array.from(categories);
  } catch (error) {
    throw error; // Rethrow error to be handled by the route
  }
}

app.get("/categories", async (req, res) => {
  try {
    // Get distinct categories from the database
    const categories = await getProductsByCategory();

    if (categories.length > 0) {
      // If categories exist, return them in the response
      return res.status(200).json({ categories });
    } else {
      // If no categories are found
      return res.status(404).json({ error: "No categories found." });
    }
  } catch (error) {
    // Handle any errors (e.g., database issues)
    return res.status(500).json({ error: "Failed to fetch categories." });
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
      throw new Error(
        "Category not found or no products available for this category."
      );
    }

    return categoryData;
  } catch (error) {
    throw error; // Rethrow the error to be handled by the route
  }
}

app.get("/categories/:categoryId", async (req, res) => {
  const { categoryId } = req.params; // Get categoryId from the URL parameter

  try {
    // Fetch category data based on the categoryId
    const categoryData = await getCategoryData(categoryId);

    // Return the category data in the response
    return res.status(200).json({ data: { category: categoryData } });
  } catch (error) {
    // Handle errors: no products found, category not found, etc.
    if (
      error.message ===
      "Category not found or no products available for this category."
    ) {
      return res.status(404).json({ error: error.message });
    }

    // Internal server error
    return res.status(500).json({ error: "Failed to fetch category data." });
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
    const wishlist = await readWishlist(); // Use the separate function
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
    const { productId } = req.body; // Get productId from the request body

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const updatedWishlist = await addToWishlist(productId);

    res.status(201).json({
      message: "Product added to wishlist successfully!",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to add product to wishlist." });
  }
});

app.delete('/wishlist/:wishlistId/item/:productId', async (req, res) => {
  try {
    const { wishlistId, productId } = req.params;

    console.log('DELETE request received - Wishlist ID:', wishlistId, 'Product ID:', productId);

    if (!ObjectId.isValid(wishlistId) || !ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid Wishlist ID or Product ID' });
    }

    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      wishlistId,
      { $pull: { items: { productId: new ObjectId(productId) } } }, // Convert to ObjectId
      { new: true }
    ).populate('items.productId');

    console.log('Updated Wishlist:', updatedWishlist);

    if (!updatedWishlist) {
      console.log('No wishlist found for ID:', wishlistId);
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    // Check if the item was removed
    const itemStillExists = updatedWishlist.items.some(
      (item) => item.productId.toString() === productId
    );
    if (itemStillExists) {
      console.log('Item with Product ID:', productId, 'not removed from Wishlist:', wishlistId);
      return res.status(404).json({ error: 'Product not found in wishlist or not removed' });
    }

    res.status(200).json({
      message: 'Item removed from wishlist successfully',
      updatedWishlist: updatedWishlist,
    });
  } catch (error) {
    console.error('Error in DELETE route:', error.message);
    res.status(500).json({ error: 'Failed to remove item from wishlist', details: error.message });
  }
});

async function readCart() {
  try {
      const cart = await Cart.findOne().populate("items.productId");
      return cart;
  } catch (error) {
      throw error;
  }
}

app.get("/cart", async (req, res) => {
  try {
      const cart = await readCart();
      if (!cart) {
          return res.status(404).json({ error: "Cart not found." });
      }
      res.json(cart);
  } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart." });
  }
});

// Cart add function
async function addToCart(productId, quantity = 1) {
  try {
      // Find the first cart (or create one)
      let cart = await Cart.findOne();

      if (!cart) {
          // If no cart exists, create a new one
          cart = new Cart({
              items: [{ productId, quantity }],
          });
      } else {
          // Check if product already exists in cart
          const itemIndex = cart.items.findIndex(
              item => item.productId.toString() === productId.toString()
          );

          if (itemIndex > -1) {
              // If product exists, update quantity
              cart.items[itemIndex].quantity += quantity;
          } else {
              // If product doesn't exist, add it
              cart.items.push({ productId, quantity });
          }
      }

      // Save the cart to the database
      const savedCart = await cart.save();

      // Return the saved cart object for confirmation
      console.log("Updated Cart:", savedCart);
      return savedCart;
  } catch (error) {
      console.error("Error adding product to cart:", error.message);
      throw new Error("Failed to add product to cart.");
  }
}

// POST Cart API endpoint
app.post("/cart", async (req, res) => {
  try {
      const { productId, quantity } = req.body; // Get productId and quantity from request body

      if (!productId) {
          return res.status(400).json({ error: "Product ID is required." });
      }

      // Validate quantity if provided
      const qty = quantity && !isNaN(quantity) && quantity > 0 ? quantity : 1;

      const updatedCart = await addToCart(productId, qty);

      res.status(201).json({
          message: "Product added to cart successfully!",
          cart: updatedCart,
      });
  } catch (error) {
      res.status(500).json({
          error: error.message || "Failed to add product to cart."
      });
  }
});

app.delete('/cart/:cartId/item/:productId', async (req, res) => {
  try {
      const { cartId, productId } = req.params;

      console.log('DELETE request received - Cart ID:', cartId, 'Product ID:', productId);

      if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ error: 'Invalid Cart ID or Product ID' });
      }

      const updatedCart = await Cart.findByIdAndUpdate(
          cartId,
          { $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } } },
          { new: true }
      ).populate('items.productId');

      console.log('Updated Cart:', updatedCart);

      if (!updatedCart) {
          console.log('No cart found for ID:', cartId);
          return res.status(404).json({ error: 'Cart not found' });
      }

      // Check if the item was removed
      const itemStillExists = updatedCart.items.some(
          item => item.productId.toString() === productId
      );
      if (itemStillExists) {
          console.log('Item with Product ID:', productId, 'not removed from Cart:', cartId);
          return res.status(404).json({ error: 'Product not found in cart or not removed' });
      }

      res.status(200).json({
          message: 'Item removed from cart successfully',
          updatedCart: updatedCart,
      });
  } catch (error) {
      console.error('Error in DELETE cart route:', error.message);
      res.status(500).json({ error: 'Failed to remove item from cart', details: error.message });
  }
});

app.patch('/cart/:cartId/item/:productId', async (req, res) => {
  try {
      const { cartId, productId } = req.params;
      const { quantity } = req.body;

      console.log('PATCH request received - Cart ID:', cartId, 'Product ID:', productId, 'New Quantity:', quantity);

      // Validate IDs and quantity
      if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ error: 'Invalid Cart ID or Product ID' });
      }

      if (!quantity || isNaN(quantity) || quantity < 1) {
          return res.status(400).json({ error: 'Quantity must be a number greater than 0' });
      }

      const updatedCart = await Cart.findOneAndUpdate(
          { _id: cartId, 'items.productId': productId },
          { $set: { 'items.$.quantity': quantity } },
          { new: true }
      ).populate('items.productId');

      console.log('Updated Cart:', updatedCart);

      if (!updatedCart) {
          console.log('No cart found or item not in cart - Cart ID:', cartId, 'Product ID:', productId);
          return res.status(404).json({ error: 'Cart or product not found' });
      }

      res.status(200).json({
          message: 'Cart item quantity updated successfully',
          updatedCart: updatedCart,
      });
  } catch (error) {
      console.error('Error in PATCH cart route:', error.message);
      res.status(500).json({ error: 'Failed to update cart item quantity', details: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
