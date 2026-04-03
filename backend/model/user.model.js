import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    fullName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,

    },
    role:{
        type:String,
        enum:["student","teacher"],
        lowercase:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    targetSemester:{
        type: Number,
        required : function(){
            return this.role==="student"
        }
    }
})

const User = mongoose.model("User",userSchema);
export default User;