const mongoose=require('mongoose');
const env=require('../config');

const connectDB=async()=>{
    const conn=await mongoose.connect(env.MONGO);
    console.log("database connected");
    return conn;
}

module.exports=connectDB;