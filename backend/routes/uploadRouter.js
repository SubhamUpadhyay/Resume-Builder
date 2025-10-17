const express = require("express");
const uploadRouter = express.Router();
const { uploadImage } = require("../controllers/uploadController");
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Protected route for image upload
uploadRouter.post('/', protect, upload.single('image'), uploadImage);

module.exports = uploadRouter;