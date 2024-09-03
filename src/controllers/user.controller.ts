import { Request, Response } from "express";
import userService from "../services/user.service"; // Убедитесь, что путь к файлу правильный

export const getUser = (req: any, res: Response) => {
    res.send("This is a GET request for a user route");
};

export const getAllUsers = async (req: any, res: Response) => {
    try {
        const users = await userService.findAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const showUserProducts = async (req: any, res: Response) => {
    try {
        const user = req.user

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const products = await userService.showUserProducts(user.id);
        res.status(200).json({
            products
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
