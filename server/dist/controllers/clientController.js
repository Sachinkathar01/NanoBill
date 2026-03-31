import { ClientServices } from "../services/clientService.js";
export const createClient = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, address } = req.body;
        if (!name) {
            res.status(400).json({ message: "Client name is required" });
            return;
        }
        const client = await ClientServices.createClient(userId, name, email, phone, address);
        res.status(201).json({ client });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const getClients = async (req, res) => {
    try {
        const userId = req.user.id;
        const clients = await ClientServices.getClientsByUser(userId);
        res.status(200).json({ clients });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const updateClient = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const { name, email, phone, address } = req.body;
        const updatedClient = await ClientServices.updateClient(id, userId, name, email, phone, address);
        if (!updatedClient) {
            res.status(404).json({ message: "Client not found or unauthorized" });
            return;
        }
        res.status(200).json({ client: updatedClient });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
export const deleteClient = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const success = await ClientServices.deleteClient(id, userId);
        if (!success) {
            res.status(404).json({ message: "Client not found or unauthorized" });
            return;
        }
        res.status(200).json({ message: "Client deleted successfully" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
//# sourceMappingURL=clientController.js.map