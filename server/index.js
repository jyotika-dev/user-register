const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const userModel = require("./models/user");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));

// ✅ Connect to MongoDB (Use Atlas or Local DB)
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/user", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
}

// ✅ Registration Endpoint
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                message: "User already registered. Redirecting to login...",
                redirect: "/login"
            });
        }

        const newUser = await userModel.create({ name, email, password });
        res.json({ message: "Successfully Registered", user: newUser });

    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});

// ✅ Login Endpoint
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ message: "User Not Registered. Click on Register" });
        }

        if (user.password !== password) {
            return res.json({ message: "Invalid Password" });
        }

        res.json({ message: "Successfully Logged In", user });

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Login failed" });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
