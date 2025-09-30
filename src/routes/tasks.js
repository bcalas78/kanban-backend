const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

// Route POST /projects/:projectId/tasks -> Créer une tâche
router.post("/projects/:projectId/tasks", authMiddleware, async (req, res) => {
    const { title, description, status, dueDate, assignedTo } = req.body;
    const {projectId } = req.params;
    
    try {
        const project = await Project.findOne({
            where: { id: projectId, userId: req.user.id },
        });
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }
        const task = await Task.create({
            title,
            description,
            status,
            dueDate,
            projectId: project.id,
            assignedTo: assignedTo || null,
        });

        res.status(201).json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur"});
    }
});

// Route GET /projects/:projectId/tasks -> Lister toutes les tâches d'un projet de l'utilisateur
router.get("/projects/:projectId/tasks", authMiddleware, async(req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findOne({ 
            where: { id: projectId, userId: req.user.id },
        });
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        const tasks = await Task.findAll({
            where: { projectId: project.id }
        });
        res.json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route GET /tasks/:id -> Récupérer une tâche spécifique d'un projet
router.get("/tasks/:id", authMiddleware, async(req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, { include: Project });
        if (!task || task.Project.userId !== req.user.id) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route PUT /tasks/:id -> Mettre à jour une tâche spécifique d'un projet
router.put("/tasks/:id", authMiddleware, async (req, res) => {
    const { title, description, status, dueDate, assignedTo } = req.body;

    try {
        const task = await Task.findByPk(req.params.id, { include: Project });
        if (!task || task.Project.userId !== req.user.id) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }
        
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;

        await task.save();
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route DELETE /tasks/:id -> Supprimer une tâche spécifique d'un projet
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, { include: Project });
        if (!task || task.Project.userId !== req.user.id) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }
        
        await task.destroy();
        res.json({ message: "Tâche supprimée avec succès" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;