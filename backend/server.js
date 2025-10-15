import express from "express"
import cors from "cors"
import 'dotenv/config'


const app = express();
const PORT = process.env.PORT||4000;

app.use(cors())

//connect DB


//middleware


app.use(express.json())

//routes

app.get('/',(req,res)=>{
    res.send("API working");
})


app.listen(4000,()=>{
    console.log("Server started at port : 4000");
})