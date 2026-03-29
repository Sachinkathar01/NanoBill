import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pool from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(helmet());
app.use(cookieParser());

// Connect to DB (this throws error if it fails)
pool.connect()
    .then(() => console.log("Connected to PostgreSQL successfully!"))
    .catch((err) => console.error("Database connection error", err.stack));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/webhooks", webhookRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
