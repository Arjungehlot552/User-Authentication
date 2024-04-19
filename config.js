const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1:27017/Login?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1");

//Check database connect or not 

connect.then(()=>{
    console.log("Database connected successfully");
})
.catch((err)=>{
    console.log("Database cannot be connected");
    console.log(err);
})

//Create a schema
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

//Collection part
const collection = new mongoose.model("users",LoginSchema);

module.exports = collection;