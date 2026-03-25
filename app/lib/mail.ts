import nodemailer from "nodemailer";

type MailOptions = {
    to?: string | string[];
    bcc?: string | string[];
    cc?: string | string[];
    replyTo?: string;
    subject: string;
    html: string;
};

let transporter: nodemailer.Transporter | undefined;

function getRequiredEnv(name: "SMTP_USER" | "SMTP_PASS") {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required mail environment variable: ${name}`);
    }
    return value;
}

function getTransporter() {
    if (transporter) return transporter;

    const host = process.env.SMTP_HOST ?? "smtp.zoho.com";
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;

    transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user: getRequiredEnv("SMTP_USER"),
            pass: getRequiredEnv("SMTP_PASS"),
        },
    });

    return transporter;
}

function getFromAddress() {
    return process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "email@email.com";
}

export async function sendEmail(options: MailOptions) {
    if (!options.to && !options.bcc) {
        throw new Error("Email requires at least one recipient.");
    }

    return getTransporter().sendMail({
        from: getFromAddress(),
        to: options.to,
        bcc: options.bcc,
        cc: options.cc,
        replyTo: options.replyTo,
        subject: options.subject,
        html: options.html,
    });
}
