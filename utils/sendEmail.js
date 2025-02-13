import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

class MailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:"gmail",
            host:"smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    async sendMailActivationCode(toEmail, otp){
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: "Online Market akkauntini faollashtirish",
            text: "",
            html:`
            <div>
                <h2>
                    Ushbu kodni hech kimga bermang!:
                </h2>
                <h1>${otp}</h1>
             </div>
            `,
        });
    }
}

export const sendEmalOtp = new MailService();
