import mongoose from "mongoose";

export const AssigmentSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        
    },
    subject:{
        type:String,
        required:true

    },
    maxMarks:{
        type:Number,
        required:true
    },
    deadLine:{
        type:Date,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },
    targetSemester:{
        type:Number,
        required:true
    },

},{timestamps:true});

export const Assigment = mongoose.model("Assigment",AssigmentSchema);
export default Assigment;