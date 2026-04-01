import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// generate token

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            semester:user.targetSemester
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

export const createUser = async (req, res) => {
    try {
        const { name, fullName, email, password, role ,targetSemester} = req.body;
        const user = await User.findOne({ email })
        if (user) {
            console.log(user)
            return res.status(400).json({ message: "User already exists" })
        }
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name,
            fullName,
            email,
            password: hashedPassword,
            role,
            targetSemester

        })
        return res.status(201).json({ message: "User created successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};


// login user

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" })
        }
        return res.status(200).json({
            message: "Login successful", token: generateToken(user),
            user: {
                id: user._id,
                name: user.name, email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };

}

export const logoutUser = async (req, res) => {
    try {
      res.status(200).json({message:"Logout successful"})
    } catch (error) {
      return res.status(500).json({message:error.message})
    }
}