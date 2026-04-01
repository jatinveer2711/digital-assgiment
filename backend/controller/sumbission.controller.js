import Sumbission from "../model/sumbission.model.js";

// create sumbission
export const createSumbission = async (req,res)=>{
    try {
        const {assigment  , fileUrl} = req.body;
        const existingSumbission = await Sumbission.findOne({
            assigment:assigment,
            student:req.user.id
        })
        if(existingSumbission){
            return res.status(400).json({message:"Sumbission already exists for this assigment"})
        }

        const sumbission = await Sumbission.create({
            assigment:assigment,
            student:req.user.id,
            fileUrl,


        })
        return res.status(201).json({
            message:"Sumbission created successfully",
            sumbission,
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        })
    };
};

// get Sumbission by id 

export const fetchSumbission = async(req,res)=>{
    try {
        const sumbissions = await Sumbission.find({
            assigment:req.params.id,
        }).populate("student","name email");
        return res.status(200).json({
            sumbissions
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        });
    };
};

export const updateSumbission = async(req,res)=>{
    try {
        const {marks,feedBack} = req.body;
        const sumbission = await Sumbission.findByIdAndUpdate(req.params.id,{
            marks,
            feedBack},
            {new:true}
        )
        return res.status(200).json({
            message:"Sumbission grade successfully",
            sumbission
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    };
};

// get submission by student id

export const fetchSumbsissionBystudent = async(req,res)=>{
    try {
        const id = req.user.id
        const sumbissions = await Sumbission.find({
            student:id,
        }).sort({createdAt: -1}).populate("assigment","title description");
        if(sumbissions.length===0){
            return res.status(404).json({
                message:"No sumbission found "
            })
        }
        return res.status(200).json({
            sumbissions
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
        });
    }
}

