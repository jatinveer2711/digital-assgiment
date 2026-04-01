import express from "express";
import { authMiddleware,facultyMiddleware,studentMiddleware } from "../middleware/middleware.js";
import { createAssigment,getAllAssigments,getfacultyAssigments,updateAssigment,deleteAssigment } from "../controller/assigment.controller.js";

const router = express.Router()

router.post('/createAssigment',authMiddleware,facultyMiddleware,createAssigment);
router.get('/fetchAssigment',authMiddleware,facultyMiddleware,getfacultyAssigments);
router.put('/updateAssigment/:id',authMiddleware,facultyMiddleware,updateAssigment);
router.delete('/deleteAssigment/:id',authMiddleware,facultyMiddleware,deleteAssigment);

router.get('/getAllAssigment',authMiddleware,studentMiddleware,getAllAssigments)
export default router;