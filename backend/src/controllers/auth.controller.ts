import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User already exists",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to register user",
        });
    }
};



// login

export const loginUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }


        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(500).json({
                success: false,
                message: "JWT_SECRET is missing in .env file",
            });
            return;
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role,
            },
            jwtSecret,
            {
                expiresIn: "7d",
            }
        );



        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to login",
        });
    }
};