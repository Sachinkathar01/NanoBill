import Razorpay from "razorpay";
import "dotenv/config";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("WARNING: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env");
}

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export default razorpayInstance;
