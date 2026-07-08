import mongoose from "mongoose";

 const connectDB = async(req,res)=>{
    try {
        const MONGO_URI=process.env.MONGO_URI;
        await mongoose.connect(MONGO_URI);
        console.log('MongoDb Connected');
    } catch (error) {
        console.error('MongoDB error during connection' , error.message);
        process.exit(1);
    }
}

export default connectDB