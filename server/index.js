const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require('./models/user');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/user");

// Registration 
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    userModel.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                res.json({
                    message: "User already registered. Redirecting to login...",
                    redirect: "/login"
                });
            } else {
                userModel.create(req.body)
                    .then(newUser => {
                        res.json({ message: "Successfully Registered", user: newUser });
                    })
                    .catch(err => {
                        console.error("Error during registration:", err);
                        res.status(500).json({ message: "Registration failed" });
                    });
            }
        })
        .catch(err => {
            console.error("Error checking for existing user:", err);
            res.status(500).json({ message: "Registration failed" });
        });
});

// Login 
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({ message: "Successfully Logged In", user: user });
                } else {
                    res.json({ message: "Invalid Password" });
                }
            } else {
                res.json({ message: "User Not Registered. Click on Register" });
            }
        })
        .catch(err => {
            console.error("Error during login:", err);
            res.status(500).json({ message: "Login failed" });
        });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});