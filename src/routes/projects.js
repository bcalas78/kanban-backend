const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

// Route POST /projects -> Créer un projet
router.post("/", authMiddleware, async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = await Project.create({
            name,
            description,
            userId: req.user.id,
        });
        res.status(201).json(project);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur"});
    }
});

// Route GET /projects -> Lister tous les projets de l'utilisateur
router.get("/", authMiddleware, async(req, res) => {
    try {
        const projects = await Project.findAll({ where: {userId: req.user.id }});
        res.json(projects);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route GET /projects/:id -> Récupérer un projet spécifique de l'utilisateur
router.get("/:id", authMiddleware, async(req, res) => {
    try {
        const project = await Project.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }
        res.json(project);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route PUT /projects/:id -> Mettre à jour un projet spécifique de l'utilisateur
router.put("/:id", authMiddleware, async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = await Project.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }
        
        project.name = name || project.name;
        project.description = description || project.description;
        await project.save();

        res.json(project);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route DELETE /projects/:id -> Supprimer un projet spécifique de l'utilisateur
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }
        
        await project.destroy();

        res.json({ message: "Projet supprimé avec succès" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;