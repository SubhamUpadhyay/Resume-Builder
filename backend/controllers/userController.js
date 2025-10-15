const User = require("../models/userModel");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
require('dotenv').config();

const generateToken = (userId) =>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'7d'});
}

const registerUser = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const userExist = await User.findOne({email});
        if(userExist)
        {
            return res.status(400).json({message:"User Already Exist . Try another Email"});

        }
        if(password.length <8)
        {
            return res.status(400).json({success:false,message:"Password must be atleast 8 character long"});
        }

        //hashing password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password,salt);

        //create a user
        const user = await User.create({
            name,email,password:hashedPassword
        });
        res.status(201).json({_id:user._id,name:user.name,email:user.email,token:generateToken(user._id)})


    }catch(err)
    {
        res.status(500).json({
            message:"Server Error",
            error:err.message
        })
    }
}

