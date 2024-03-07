import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from "../config/envirenmentVariables";

class MailService {
    transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD
            }
        } as nodemailer.TransportOptions);
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: SMTP_USER,
            to,
            subject: "Account activation in Amazon",
            text: '',
            html:
                `
                    <div>
                        <h1>For activation move to this link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

export default new MailService();