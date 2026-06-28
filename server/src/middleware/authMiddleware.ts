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
    console.log("[AUTH MIDDLEWARE] Cookies token:", token ? "Exists" : "Missing");
    console.log("[AUTH MIDDLEWARE] Auth Header:", req.header("Authorization") ? "Exists" : "Missing");

    if (!token && req.header("Authorization")) {
        token = req.header("Authorization")?.replace("Bearer ", "");
        console.log("[AUTH MIDDLEWARE] Extracted token from Auth Header:", token ? "Exists" : "Missing");
    }

    if (!token) {
        console.log("[AUTH MIDDLEWARE] No token found in cookies or headers.");
        res.status(401).json({ message: "Authorization denied, no token" });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || "ilovenanobillsecret";
        const verify = jwt.verify(token, secret) as any;
        console.log("[AUTH MIDDLEWARE] Token successfully verified for user ID:", verify?.user?.id);

        // Attach user info to request
        req.user = verify.user;
        next();
    } catch (err: any) {
        console.log("[AUTH MIDDLEWARE] Token verification failed:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};
