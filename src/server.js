require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");
const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");
const Comment = require("./models/Comment");

const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const projectRoutes = require("./routes/projects");
app.use("/projects", projectRoutes);

const taskRoutes = require("./routes/tasks");
app.use(taskRoutes);

const commentRoutes = require("./routes/comment");
app.use(commentRoutes);