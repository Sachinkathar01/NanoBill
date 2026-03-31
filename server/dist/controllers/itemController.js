import { ItemServices } from "../services/itemService.js";
import { uploadToCloudinary } from "../utils/cloudinaryUtil.js";
export const createItem = async (req, res) => {
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
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const getItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await ItemServices.getItemsByUser(userId);
        res.status(200).json({ items });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const updateItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
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
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const deleteItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const success = await ItemServices.deleteItem(id, userId);
        if (!success) {
            res.status(404).json({ message: "Item not found or unauthorized" });
            return;
        }
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
//# sourceMappingURL=itemController.js.map