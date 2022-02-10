const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const Product = require('../models/Product');
const router = require("express").Router();

// CREATE Product
router.post('/', verifyTokenAndAdmin, async(req,res)=>{
    const newProduct = new Product(req.body);
    
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json({
            "message":"Product upload successful",
            "data":savedProduct
        });
    }catch(err){
        res.status(500).json({
            "message":err
        });
    }
});

module.exports = router


