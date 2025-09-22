const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

const app = express();
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
    res.send("API Kanban is working 🚀");
});

const PORT = process.env.PORT || 4000;

// Connexion DB et lancement du serveur
sequelize.authenticate()
    .then(() => {
        console.log("Connexion réussie à PostgreSQL");
        app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
    })
    .catch(err => console.error("Erreur lors de la connexion à la DB:", err));