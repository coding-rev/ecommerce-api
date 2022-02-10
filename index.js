/*
Models Done
TODO: Understand the stats routes in users
Video: @
*/
const express       = require("express");
const app           = express();
const mongoose      = require("mongoose");
const dotenv        = require("dotenv");
const userRoute     = require('./routes/user');
const authRoute     = require('./routes/auth');
const productRoute  = require('./routes/product'); 
dotenv.config()

// Connecting DB
mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("DB Connection is successfull!"))
.catch((err)=>{
    console.log(err);
});

// Main Routes 
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use('/api/products', productRoute);

// Server
app.listen(process.env.PORT || 5000, ()=>{
    console.log("Server listening on port 5000...")
})
