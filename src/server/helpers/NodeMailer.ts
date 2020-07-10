import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import secretData from "../../../secretData.json";

export class NodeMailer {

    private _apiUrl: string = "";

    private get transporter(): Mail {
        const transporter = nodemailer.createTransport(
            secretData.nodemailer.createTransport,
        );
        return transporter;
    }

    public async sendMail(subject: string, htmlBodyElement: string): Promise<void> {
        const mailOptions = {
            from: secretData.nodemailer.mailOptions.from, // sender address
            html: htmlBodyElement,
            "subject": subject,
            to: secretData.nodemailer.mailOptions.to, // list of receivers
            };
        this.transporter.sendMail(mailOptions);
    }

}
