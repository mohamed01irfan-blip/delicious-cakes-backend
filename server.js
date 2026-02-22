const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("🎂 Delicious Cakes Backend is Running Successfully!");
});

// 🔗 MongoDB Connection
const MONGO_URL = "mongodb+srv://cakeadmin:mdirfan@cluster0.9zuekek.mongodb.net/delicious_cakes?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL)
.then(() => {
    console.log("✅ MongoDB Connected Successfully!");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
});

// 📦 Order Schema (UPGRADED FOR ADMIN)
const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    cakeType: String,
    location: String,
    cakeKg: Number,
    advanceAmount: Number,
    paymentMethod: String,
    paymentStatus: {
        type: String,
        default: "Advance Paid"
    },
    orderStatus: {
        type: String,
        default: "Pending" // 🔥 ADMIN WILL UPDATE THIS
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Model
const Order = mongoose.model("Order", orderSchema);
// 🎂 Cake Products (Static for Index Page)
app.get("/api/products", (req, res) => {
    const cakes = [
        {
            name: "Chocolate Truffle Cake",
            description: "Rich chocolate cake with creamy truffle layers.",
            price: 500,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Black Forest Cake",
            description: "Delicious black forest cake with cherries & cream.",
            price: 450,
            image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Red Velvet Cake",
            description: "Soft red velvet cake with cream cheese frosting.",
            price: 600,
            image: "https://images.unsplash.com/photo-1605475128023-2f0b4b5c5f92?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Butterscotch Cake",
            description: "Classic butterscotch flavor with crunchy toppings.",
            price: 400,
            image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80"
        }
    ];

    res.json(cakes);
});

// 🎂 API 1: Save Order (Customer)
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

        const newOrder = new Order({
            name,
            phone,
            email,
            cakeType,
            location,
            cakeKg,
            advanceAmount,
            paymentMethod,
            paymentStatus: "Advance Paid",
            orderStatus: "Pending"
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

// 📊 API 2: View All Orders (Admin Dashboard)
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// 🗑 API 3: Delete Order (Admin)
app.delete("/orders/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order" });
    }
});

// 🔄 API 4: Update Order Status (Admin)
app.put("/orders/:id", async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
