const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");
const Product = require("./models/product.models");

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

async function readByCaeogry() {
  try {
    const productByCategory = await Product.find();
    return productByCategory;
  } catch (error) {
    throw error;
  }
}

app.get("/categories", async (req, res) => {
  try {
    const productByCategory = await readByCaeogry();
    if (productByCategory.length != 0) {
      res.json(productByCategory);
    } else {
      res.status(404).json({ error: "No products found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

async function readCategoriesById(categoryId) {
  try {
    const categoryById = await Product.findOne({ category: categoryId });
    return categoryById;
  } catch (error) {
    console.log(error);
  }
}

app.get("/categories/:categoryId", async (req, res) => {
  try {
    const categoryById = await readCategoriesById(req.params.categoryId);
    if (categoryById) {
      res.json(categoryById);
    } else {
      res.status(404).json({ error: "No product found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
