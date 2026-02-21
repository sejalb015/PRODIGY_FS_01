const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.render("register", { error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword
        });

        await user.save();

        res.redirect("/login");

    } catch (error) {
        res.render("register", { error: "Something went wrong" });
    }
});
// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", { error: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render("login", { error: "Wrong password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token);
        res.redirect("/dashboard");

    } catch (error) {
        res.render("login", { error: "Something went wrong" });
    }
});
module.exports = router;