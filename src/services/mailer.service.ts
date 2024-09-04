import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { User } from '@prisma/client';

// Загрузка переменных окружения из файла .env
dotenv.config();

// Создание транспортера с использованием SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true для 465, false для других портов
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

class MailerService {
    public async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_FROM, // Адрес отправителя
            to,
            subject,
            text,
            html
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    public async mailTemplate(user: User, token: string): Promise<string> {
        return `
            <h2>Здравствуйте, ${user.name}!</h2>
            <p>Для завершения регистрации перейдите по ссылке:</p>
            <a href="${process.env.CLIENT_URL}/auth/activate/${token}">Подтвердить email</a>
            <p>Или вставьте в адресную строку браузера:</p>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <p>Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.</p>
            <p>С уважением, администрация сайта.</p>
        `;
    }
}

export default new MailerService;