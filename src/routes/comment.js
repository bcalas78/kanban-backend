const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

// Route POST /tasks/:taskId/comments -> Créer un commentaire pour une tâche spécifique
router.post("/tasks/:taskId/comments", authMiddleware, async (req, res) => {
    const { content } = req.body;
    const { taskId } = req.params;
    
    try {
        const task = await Task.findByPk( taskId, { include: Project });
        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }
        const comment = await Comment.create({
            content,
            taskId: task.id,
            userId: req.user.id,
        });

        res.status(201).json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur"});
    }
});

// Route GET /tasks/:taskId/comments -> Lister tous les commentaires d'une tâche
router.get("/tasks/:taskId/comments", authMiddleware, async(req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findByPk(taskId, { include: Project });
        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        const comments = await Comment.findAll({
            where: { taskId: task.id },
            order: [["createdAt", "ASC"]],
        });

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route PUT /comments/:id -> Mettre à jour un commentaire spécifique d'une tâche
router.put("/comments/:id", authMiddleware, async (req, res) => {
    const { content } = req.body;

    try {
        const comment = await Comment.findByPk(req.params.id, { include: Task });
        if (!comment || (comment.userId !== req.user.id && comment.Task.Project.userId !== req.user.id)) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }
        
        comment.content = content || comment.content;
        await comment.save();

        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route DELETE /comments/:id -> Supprimer un commentaire spécifique d'une tâche
router.delete("/comments/:id", authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id, { include: Task });
        if (!comment || (comment.userId !== req.user.id && comment.Task.Project.userId !== req.user.id)) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }
        
        await comment.destroy();
        res.json({ message: "Commentaire supprimé avec succès" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;