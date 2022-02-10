const router = require("express").Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

// Register View
router.post('/register', async (req,res)=>{
    // Creating new user object
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.SECRET_KEY
        ).toString(),
    });
    // Saving user and return response
    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); 
    }catch(err){
        res.status(500).json(err)
    }
}); 

// Login View
router.post('/login', async (req,res)=>{
    try{
        // Getting user
        const user = await User.findOne({username:req.body.username});

        // Check if user exist
        !user && res.status(401).json("Wrong credentials")

        // Decrypting user password 
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.SECRET_KEY
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password && res.status(401).json("Wrong credentials!"); 
        
        // Generating token for loggedIn user
        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin,
        }, 
        process.env.SECRET_KEY,
        {expiresIn:"3d"} // Setting token expiration to 3 days
        );

        // Filtering password out of the default response
        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router


