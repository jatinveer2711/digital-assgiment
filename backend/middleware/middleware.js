import express from "express";

import jwt from "jsonwebtoken"

export const authMiddleware = (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization ;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"Unauthorized Access"})
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded ;
        next()
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const facultyMiddleware = (req,res,next)=>{
    try {
       
        if(req.user.role !== "teacher"){
            
            return res.status(401).json("forbidden access")
        }
        
        next();
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
};

export const studentMiddleware = (req,res,next)=>{
    try {
        
        if(req.user.role !== "student"){
            return res.status(401).json("access denied")
        }
        next()
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}