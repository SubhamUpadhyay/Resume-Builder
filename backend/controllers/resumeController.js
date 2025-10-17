const path = require("path");
const Resume = require("../models/resumeModel");
const fs = require('fs');

const createResume = async(req, res) => {
    try {
        const { title } = req.body;
        const defaultResumeData = {
            profileInfo: {
                profilePreviewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certification: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            interest: [''],
        };

        const newResume = await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body
        });
        
        res.status(201).json(newResume);
    } catch(err) {
        res.status(500).json({ message: "Failed to create Resume", error: err.message });
    }
}

const getUserResumes = async(req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch(err) {
        res.status(500).json({ message: "Failed to get resumes", error: err.message });
    }
}

const getResumeById = async(req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.json(resume);
    } catch(err) {
        res.status(500).json({ message: "Failed to get resume", error: err.message });
    }
}

const updateResume = async(req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }
        
        // Merge updates
        Object.assign(resume, req.body);
        
        // Save updated resume
        const savedResume = await resume.save();
        res.json(savedResume);
    } catch(err) {
        res.status(500).json({ message: "Failed to update Resume", error: err.message });
    }
}

const deleteResume = async(req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not authorized" });
        }

        const uploadFolder = path.join(process.cwd(), 'uploads');

        // Delete thumbnail if exists
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }
        
        // Delete profile image if exists
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
                uploadFolder,
                path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile);
            }
        }

        await Resume.deleteOne({ _id: req.params.id });
        res.json({ message: "Resume deleted successfully" });
    } catch(err) {
        res.status(500).json({ message: "Failed to delete Resume", error: err.message });
    }
}

module.exports = {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume
};