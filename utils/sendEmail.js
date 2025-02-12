import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

const transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = {
    async sendMail(req, res = { status: () => ({ json: () => {} }) }) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: "Email is required" });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Sending Email With Nodemailer",
                text: "Assalomu alaykum! Yurtim senga she'r bittim bugun qiyosong!",
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: `Email ${email} ga muvaffaqiyatli yuborildi.` });
        } catch (error) {
            res.status(500).json({ message: "Email yuborishda xatolik", error });
        }
    },
};
