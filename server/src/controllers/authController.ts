import type { Request, Response } from "express";
import { AuthServices } from "../services/authService.js";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const userExists = await AuthServices.checkUserExists(email);
        if (userExists) {
            res.status(401).json({ message: "User already exists!" });
            return;
        }

        const { user, token } = await AuthServices.register(name, email, password);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const loginResult = await AuthServices.login(email, password);

        if (!loginResult) {
            res.status(401).json({ message: "Password or Email is incorrect" });
            return;
        }

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", loginResult.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ user: { id: loginResult.user.id, name: loginResult.user.name, email: loginResult.user.email }, token: loginResult.token });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // expires immediately
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const user = await AuthServices.getUserById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ user });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server error checking user" });
    }
};
