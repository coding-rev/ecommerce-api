const jwt = require('jsonwebtoken');

// Token Verification middleware
const verifyToken = (req,res,next)=>{
    // Requesting token in headers
    const authHeader = req.headers.token
    
    // Verifying token
    if(authHeader){
        // Extracting token from "Bearer <token>"
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err,user)=>{
            if(err) res.status(403).json({
                "message":"Token is not valid!"
            });
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json({
            "message":"You are not authenticated!"
    });
    }
};

// Authorization Middleware For Registered User
const verifyTokenAndAuthorization = (req, res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(401).json({
                "message":"You are not allowed to do that!"
            });
        }
    });
};

// Authorization Middleware for Admins only
const verifyTokenAndAdmin = (req, res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(401).json({
                "message":"You are not allowed to do that!"
            });
        }
    });
};


module.exports = { 
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
};


