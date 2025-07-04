import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        mongoose.connection.on('connected',()=>console.log("Mongodb connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    }catch(err)
{
    console.log(err.message);
}
}

export default connectDB
