import type { Request, Response } from "express";
import { ItemServices } from "../services/itemService.js";
import { uploadToCloudinary } from "../utils/cloudinaryUtil.js";

export const createItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { name, description, default_price } = req.body;

        if (!name || default_price === undefined) {
             res.status(400).json({ message: "Item name and default_price are required" });
             return;
        }

        let imageUrl = null;
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            imageUrl = uploadResult.secure_url;
        }

        const item = await ItemServices.createItem(userId, name, description, default_price, imageUrl);
        res.status(201).json({ item });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const items = await ItemServices.getItemsByUser(userId);
        res.status(200).json({ items });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const id = req.params.id as string;
        const { name, description, default_price } = req.body;

        let imageUrl = undefined;
        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            imageUrl = uploadResult.secure_url;
        }

        const updatedItem = await ItemServices.updateItem(id, userId, name, description, default_price, imageUrl);
        
        if (!updatedItem) {
            res.status(404).json({ message: "Item not found or unauthorized" });
            return;
        }
        res.status(200).json({ item: updatedItem });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const id = req.params.id as string;

        const success = await ItemServices.deleteItem(id, userId);
        
        if (!success) {
            res.status(404).json({ message: "Item not found or unauthorized" });
            return;
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
