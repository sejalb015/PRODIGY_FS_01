const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");

// routes
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);


// render pages
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/register", (req, res) => {
    res.render("register", { error: null });
});

app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// protected dashboard
app.get("/dashboard", authMiddleware, (req, res) => {
    res.render("dashboard");
});

// logout
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

// protected API route
app.get("/api/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to dashboard!" });
});

// connect DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});