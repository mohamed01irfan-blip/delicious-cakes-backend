const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// ================= PRODUCTS DATABASE =================
// NOTE: Use ONLINE image URLs (not /images/...)
let products = [
  {
    _id: uuidv4(),
    name: "Black Forest Cake",
    price: 500,
    category: "chocolate",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    _id: uuidv4(),
    name: "Red Velvet Cake",
    price: 600,
    category: "premium",
    image: "https://images.unsplash.com/photo-1605478035137-6f6e4b1cd5df"
  }
];

// ================= ORDERS DATABASE =================
let orders = [];

// ================= PRODUCTS API =================

// GET all cakes (Customer Website)
app.get("/api/products", (req, res) => {
  res.json(products);
});

// ADD new cake (Admin Panel)
app.post("/api/products", (req, res) => {
  const { name, price, category, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ message: "Name, price and image URL required" });
  }

  const newProduct = {
    _id: uuidv4(),
    name,
    price,
    category: category || "custom",
    image // 🔥 Direct online image URL
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// DELETE cake
app.delete("/api/products/:id", (req, res) => {
  products = products.filter(p => p._id !== req.params.id);
  res.json({ message: "Cake deleted successfully" });
});

// ================= ORDERS API (NEW - ADMIN DASHBOARD FIX) =================

// CREATE ORDER (Customer side)
app.post("/api/orders", (req, res) => {
  const {
    name,
    phone,
    cakeType,
    cakeKg,
    location,
    advanceAmount
  } = req.body;

  const newOrder = {
    _id: uuidv4(),
    name,
    phone,
    cakeType,
    cakeKg,
    location,
    advanceAmount,
    orderStatus: "Pending",
    createdAt: new Date()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// GET ALL ORDERS (Admin Dashboard)
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// UPDATE ORDER STATUS
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const order = orders.find(o => o._id === id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = orderStatus || order.orderStatus;
  res.json(order);
});

// DELETE ORDER (Admin)
app.delete("/api/orders/:id", (req, res) => {
  orders = orders.filter(o => o._id !== req.params.id);
  res.json({ message: "Order deleted successfully" });
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🎂 Delicious Cakes Backend with Admin + Orders Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});