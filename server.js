const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANT: Your live backend URL (change only if needed)
const BASE_URL = "https://delicious-cakes-backend.onrender.com";

// ================= SERVE STATIC IMAGES =================
app.use("/images", express.static(path.join(__dirname, "images")));

// ================= PRODUCTS (ADMIN CAN LATER ADD DB) =================
let products = [
  {
    _id: 1,
    name: "Black Forest Cake",
    price: 500,
    category: "chocolate",
    image: `${BASE_URL}/images/black-forest.jpg`,
  },
  {
    _id: 2,
    name: "Red Velvet Cake",
    price: 600,
    category: "premium",
    image: `${BASE_URL}/images/red-velvet.jpg`,
  },
  {
    _id: 3,
    name: "Strawberry Cake",
    price: 450,
    category: "fruit",
    image: `${BASE_URL}/images/strawberry.jpg`,
  },
  {
    _id: 4,
    name: "Vanilla Cake",
    price: 400,
    category: "basic",
    image: `${BASE_URL}/images/vanilla.jpg`,
  },
];

// ================= ORDERS STORAGE (TEMP - NO DB) =================
let orders = [];

// ================= GET ALL PRODUCTS =================
app.get("/api/products", (req, res) => {
  res.json(products);
});

// ================= ADD NEW PRODUCT (ADMIN FEATURE) =================
app.post("/api/products", (req, res) => {
  const { name, price, category, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price required" });
  }

  const newProduct = {
    _id: products.length + 1,
    name,
    price,
    category: category || "custom",
    image: image || `${BASE_URL}/images/default.jpg`,
  };

  products.push(newProduct);
  res.status(201).json({
    message: "Cake added successfully 🎂",
    product: newProduct,
  });
});

// ================= PLACE ORDER (VERY IMPORTANT) =================
app.post("/api/orders", (req, res) => {
  const order = {
    _id: orders.length + 1,
    ...req.body,
    createdAt: new Date(),
  };

  orders.push(order);

  res.status(201).json({
    message: "Order stored successfully 🎉",
    order: order,
  });
});

// ================= GET ALL ORDERS (ADMIN DASHBOARD) =================
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// ================= UPDATE ORDER STATUS (ADMIN CONTROL) =================
app.put("/api/orders/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { orderStatus } = req.body;

  const order = orders.find(o => o._id === id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = orderStatus || order.orderStatus;

  res.json({
    message: "Order status updated",
    order,
  });
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("🍰 Delicious Cakes Backend Running Successfully 🚀");
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});