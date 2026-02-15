const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔗 PASTE YOUR MONGODB URL HERE
const MONGO_URL = "mongodb+srv://cakeadmin:mdirfan@cluster0.9zuekek.mongodb.net/delicious_cakes?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGO_URL)
.then(() => {
    console.log("✅ MongoDB Connected Successfully!");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
});

// 📦 Order Schema (Customer Details)
const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    cakeType: String, // 👈 NEW (Cake Type)
    location: String,
    cakeKg: Number,
    advanceAmount: Number,
    paymentMethod: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Model
const Order = mongoose.model("Order", orderSchema);

// 🎂 API to Save Order
app.post("/order", async (req, res) => {
    try {
        const { name, phone, email, cakeType, location, cakeKg, paymentMethod } = req.body;


        // 💰 Advance Amount Logic
        let advanceAmount = 0;
        if (cakeKg == 1) {
            advanceAmount = 200;
        } else if (cakeKg == 2) {
            advanceAmount = 350;
        } else {
            advanceAmount = cakeKg * 200;
        }

        // Save Order
        const newOrder = new Order({
    name,
    phone,
    email,
    cakeType, // 👈 SAVE CAKE TYPE
    location,
    cakeKg,
    advanceAmount,
    paymentMethod
});

        await newOrder.save();

        res.json({
            message: "Order Saved Successfully!",
            advance: advanceAmount
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving order" });
    }
});

// 📊 API to View All Orders (Admin)
app.get("/orders", async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// Start Server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
