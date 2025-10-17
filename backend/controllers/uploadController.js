const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Return the file URL
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            message: "File uploaded successfully",
            url: fileUrl,
            filename: req.file.filename
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to upload image", error: err.message });
    }
};

module.exports = { uploadImage };