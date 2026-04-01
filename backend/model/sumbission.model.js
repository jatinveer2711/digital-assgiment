import mongoose from "mongoose";

const sumbissionSchema = new mongoose.Schema({
    assigment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Assigment",
        required:true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    marks:{
        type:Number,
        default:0
    },
    feedBack:{
        type:String
    },

    
},{timestamps:true})

const Sumbission = mongoose.model("Sumbission",sumbissionSchema);

export default Sumbission;