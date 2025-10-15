const express = require('express')
const cors = require('cors')
require('dotenv').config();
const connectDB = require('./config/db')


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

//connect DB

//middleware

app.use(express.json());

//routes

app.get("/", (req, res) => {
  res.send("API working");
});

async function connect() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server started at port : 4000");
    });
  } catch (err) {
    console.log("Error in server.js ", err);
  }
}


connect();