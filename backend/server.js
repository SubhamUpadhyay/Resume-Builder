const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const resumeRouter = require('./routes/resumeRouter');
const uploadRouter = require('./routes/uploadRouter');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
}));
app.use(express.json());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/upload', uploadRouter);

app.get("/", (req, res) => {
    res.send("Resume Builder API is running");
});

async function connect() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server started at port: ${PORT}`);
        });
    } catch (err) {
        console.log("Error in server.js:", err);
    }
}

connect();