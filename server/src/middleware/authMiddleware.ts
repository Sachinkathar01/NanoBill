import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Augment the Request type to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    // Get token from cookie, fallback to Authorization header
    let token = req.cookies.token;
    if (!token && req.header("Authorization")) {
        token = req.header("Authorization")?.replace("Bearer ", "");
    }

    if (!token) {
        res.status(401).json({ message: "Authorization denied, no token" });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || "ilovenanobillsecret";
        const verify = jwt.verify(token, secret) as any;

        // Attach user info to request
        req.user = verify.user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
