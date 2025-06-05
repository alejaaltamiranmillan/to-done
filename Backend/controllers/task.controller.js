const Task = require('../models/task.model');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas' });
    }
};

const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            user: req.user.id,
            completed: false
        });

        res.status(201).json({
            success: true,
            task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear la tarea'
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { completed: req.body.completed },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la tarea' });
    }
};

module.exports = { getTasks, createTask, updateTask };
