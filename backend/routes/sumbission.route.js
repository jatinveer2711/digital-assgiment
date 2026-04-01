import express from "express";

import { createSumbission, fetchSumbission , updateSumbission,fetchSumbsissionBystudent } from "../controller/sumbission.controller.js";
import {authMiddleware,facultyMiddleware,studentMiddleware} from "../middleware/middleware.js"

const router = express.Router();

router.post("/create",authMiddleware,studentMiddleware,createSumbission);
router.get("/fetch/:id",authMiddleware,facultyMiddleware,fetchSumbission);
router.put("/update/:id",authMiddleware,facultyMiddleware,updateSumbission);
router.get("/fetch-student",authMiddleware,studentMiddleware,fetchSumbsissionBystudent);

export default router;