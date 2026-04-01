import Assigment from "../model/assigment.model.js";

export const createAssigment = async(req,res)=>{
    try {
        const {title,description,subject,maxMarks,deadLine,targetSemester} = req.body;
        const assigment = await Assigment.create({
            title,
            description,
            subject,
            maxMarks,
            deadLine,
            targetSemester,
            createdBy:req.user.id
        })
        return res.status(201).json({
            success:true,
            message:"Assigment created successfully",
            assigment
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};

export const getfacultyAssigments = async(req,res)=>{
    try {
        const assigments = await Assigment.find({createdBy:req.user.id}).sort({createdAt: -1})
        if(assigments.length ===0){
            return res.status(404).json({message:"no assigment found"})
        }
        return res.status(200).json({
            success:true,
            assigments
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};

export const getAllAssigments = async(req,res)=>{
    try {
        let sem = req.user.semester
        
        const assigments = await Assigment.find({
            targetSemester:sem
        }).populate("createdBy","name").sort({createdAt: -1})
        if(assigments.length ===0){
            return res.status(404).json({message:"no assigment found"})
        }
        return res.status(200).json({
            success:true,
            assigments
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};

export const updateAssigment = async(req,res)=>{
    try {
        const {id} = req.params 
        const udpate = await  Assigment.findByIdAndUpdate(id,req.body,{new:true})
        if(!udpate){
            return res.status(404).json({message:"Assigment not found"})
        }
        return res.status(200).json({
            success:true,
            message:"Assigment updated successfully",
            udpate
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};

export const deleteAssigment = async(req,res)=>{
    try {
        const {id} = req.params
        const deleteAssigment =  await Assigment.findByIdAndDelete(id)
        return res.status(200).json({
            success:true,
            message:"Assigment was deleted"
        });


    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}