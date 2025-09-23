require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const User = require("./models/User");
const Project = require("./models/Project");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Connexion DB et lancement du serveur
sequelize
    .sync({alter: true})
    .then(() => {
        console.log("Base de données synchronisée");

        app.listen(PORT, () => { 
            console.log(`Serveur lancé sur http://localhost:${PORT}`)
        });
    })
    .catch((err) => {
        console.error("Erreur lors de la synchronisation de la DB:", err)
    });

// Route test
app.get("/", (req, res) => {
    res.send("Bienvenue sur le projet Kanban 🚀");
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);