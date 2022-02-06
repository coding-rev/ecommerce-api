/*
Models Done
TODO: Study deeper about modelling in mongoDB and NodeJS
Video: @30:46
*/
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require('./routes/user');

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

// Server
app.listen(process.env.PORT || 5000, ()=>{
    console.log("Server listening on port 5000...")
})
