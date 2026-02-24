const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   PRODUCTS (ONLINE IMAGES ONLY)
========================= */
let products = [
  {
    _id: "1",
    name: "Black Forest Cake",
    price: 500,
    category: "chocolate",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    _id: "2",
    name: "Red Velvet Cake",
    price: 600,
    category: "premium",
    image: "https://images.unsplash.com/photo-1605478521525-1a9d4c3b0c5b"
  }
];

/* =========================
   ORDERS STORAGE (TEMP DB)
========================= */
let orders = [];

/* =========================
   PRODUCT ROUTES
========================= */

// Get all cakes
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Add new cake (ADMIN)
app.post("/api/products", (req, res) => {
  const { name, price, category, image } = req.body;

  // 🔥 Force online image only
  if (!name || !price || !image) {
    return res.status(400).json({
      message: "Name, Price & Online Image URL required"
    });
  }

  // Reject offline image paths like /images/...
  if (!image.startsWith("http")) {
    return res.status(400).json({
      message: "Only ONLINE image URLs allowed (https://...)"
    });
  }

  const newProduct = {
    _id: Date.now().toString(),
    name,
    price,
    category,
    image // store full online URL
  };

  products.push(newProduct);
  res.json({
    message: "Cake added successfully",
    product: newProduct
  });
});

// Delete cake
app.delete("/api/products/:id", (req, res) => {
  products = products.filter(p => p._id !== req.params.id);
  res.json({ message: "Cake deleted" });
});

/* =========================
   ORDER ROUTES
========================= */

// Place Order
app.post("/api/orders", (req, res) => {
  const { name, phone, email, cakeType, cakeKg, location, advanceAmount } = req.body;

  if (!name || !phone || !cakeType || !cakeKg) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newOrder = {
    _id: Date.now().toString(),
    name,
    phone,
    email, // ✅ added
    cakeType,
    cakeKg,
    location,
    advanceAmount,
    orderStatus: "Pending",
    createdAt: new Date(),
  };

  orders.push(newOrder);
  res.json({ message: "Order placed successfully", order: newOrder });
});

// Get all orders (ADMIN)
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Update order status
app.put("/api/orders/:id", (req, res) => {
  const { orderStatus } = req.body;

  const order = orders.find(o => o._id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = orderStatus || order.orderStatus;
  res.json({ message: "Order updated", order });
});

// Delete order
app.delete("/api/orders/:id", (req, res) => {
  orders = orders.filter(o => o._id !== req.params.id);
  res.json({ message: "Order deleted" });
});

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});