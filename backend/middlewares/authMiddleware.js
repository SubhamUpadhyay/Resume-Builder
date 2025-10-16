const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const protect = async(req,res)=>{
    try{
        let token = req.cookies.token;
        if(!token)
        {
            return res.status(400).json({message:"token not found"});
        }
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded)
        {
            return res.status(401).json({message:"Token Expired"});
        }
        next();
    }catch(err)
    {
        res.status(401).json({message:"Token Failed",error:err.message});
    }
}

module.exports = protect;