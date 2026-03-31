import jwt from "jsonwebtoken";
export const jwtGenerator = (user_id) => {
    const payload = {
        user: {
            id: user_id
        }
    };
    // Make sure jwtSecret is in .env or provide a fallback
    const secret = process.env.JWT_SECRET || "ilovenanobillsecret";
    return jwt.sign(payload, secret, { expiresIn: "7d" });
};
//# sourceMappingURL=jwtGenerator.js.map