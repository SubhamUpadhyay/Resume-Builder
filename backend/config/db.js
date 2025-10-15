const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGOURL);
        console.log("DB conncted Successfully");
    }catch(err)
    {
        console.log("Error connecting to db",err);
    }
}
 

module.exports = connectDB;