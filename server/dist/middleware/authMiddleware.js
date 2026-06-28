import jwt from "jsonwebtoken";
export const authenticate = (req, res, next) => {
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
        const verify = jwt.verify(token, secret);
        console.log("[AUTH MIDDLEWARE] Token successfully verified for user ID:", verify?.user?.id);
        // Attach user info to request
        req.user = verify.user;
        next();
    }
    catch (err) {
        console.log("[AUTH MIDDLEWARE] Token verification failed:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};
//# sourceMappingURL=authMiddleware.js.map