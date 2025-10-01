const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        const newUser = await User.create({ username, email, password });

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: { id: newUser.id, username: newUser.username, email: newUser.email },
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur"});
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        const isPasswordValid = await user.validatePassword(password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        res.json({
            message: "Connexion réussie",
            user: { id: user.id, username: user.username, email: user.email },
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur"});
    }
});

module.exports = router;