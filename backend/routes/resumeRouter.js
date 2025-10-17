const express = require("express");
const resumeRouter = express.Router();
const {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume
} = require("../controllers/resumeController");
const protect = require('../middlewares/authMiddleware');

// All routes are protected
resumeRouter.post('/', protect, createResume);
resumeRouter.get('/', protect, getUserResumes);
resumeRouter.get('/:id', protect, getResumeById);
resumeRouter.put('/:id', protect, updateResume);
resumeRouter.delete('/:id', protect, deleteResume);

module.exports = resumeRouter;