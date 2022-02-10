const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const User = require("../models/User");

// UPDATE User View
router.put('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    // Encrypting password if submitted for update
    if(req.body.password){
        req.body.password= CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.SECRET_KEY
        ).toString();
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            // Set all provided values
            // This approach isn't a respector of field arrangements or key typos
            $set: req.body
        }, {new:true}
        );
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }

});

// DELETE User
router.delete("/:id", verifyTokenAndAuthorization, async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            "message":"User has been deleted!"
        });
    }catch(err){
        res.status(500).json({
            "message":err
        });
    }
});

// GET Single User
router.get("find/:id", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json({
            "data":others
        });
    }catch(err){
        res.status(500).json({
            "message":"An error occured"
        });
    }
});

// GET All Users
router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    // Hanling paginations
    const query = req.query.new
    try{
        const users = query 
        ?await User.find().sort({_id:-1}).limit(5) // Getting new users upto 5
        :await User.find();
        
        res.status(200).json({
            "data":users
        });
    }catch(err){
        res.status(500).json({
            "message":"An error occured."
        });
    }
});

// GET User stats
router.get('/stats', verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));

    try{

        const data = await User.aggregate([
            {$match: {createdAt:{$gte: lastYear}}},
            {
                $project:{
                    month: {$month : "$createdAt"},
                },
            },
            {
                $group:{
                    _id: "$month",
                    total:{$sum:1},
                }  
            }
        ]);
        res.status(200).json({
            "data":data
        });

    }catch(err){
        res.status(500).json({
            "message":err 
        });
    }
});

module.exports = router


