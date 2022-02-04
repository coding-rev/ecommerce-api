const express = require("express");
const app = express();
const mongoose = require("mongoose")

mongoose.connect(
    "mongodb://localhost:27017/ecommerApiDB"
)
.then(()=>console.log("DBConnection is successfull!"))
.catch((err)=>{
    console.log(err);
});

app.listen(5000, ()=>{
    console.log("Backend server is running...")
})
