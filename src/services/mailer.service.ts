import nodemailer from 'nodemailer';
import { User } from '@prisma/client';
import configService from './config.service';

// Создание транспортера с использованием SMTP
const transporter = nodemailer.createTransport({
    host: configService.getOrThrow('SMTP_HOST'),
    port: parseInt(configService.get('SMTP_PORT') || '1025'),
    secure: configService.get('SMTP_SECURE') === 'true', // true для 465, false для других портов
    auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS')
    },
    tls: {
        rejectUnauthorized: false,
        ciphers:'SSLv3'
    }
});

// const transporter = nodemailer.createTransport({
//     host: "localhost",
//     port: 1025,
//     secure: false, // use TLS
//     auth: {
//       user: "username",
//       pass: "pass",
//     },
//     tls: {
//       // do not fail on invalid certs
//       rejectUnauthorized: false,
//       ciphers:'SSLv3'
//     },
//   });

class MailerService {
    public async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const mailOptions = {
            from: configService.get('SMTP_FROM'), // Адрес отправителя
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

    // <a href="${process.env.CLIENT_URL}/auth/activate/${token}">Подтвердить email</a>
    
    /**
     * template for regestration email that will be sent to user
     * @param user 
     * @param token 
     * @returns 
     */
    public async mailTemplate(user: User, token: string): Promise<string> {
        return `
            <h2>Здравствуйте, ${user.name}!</h2>
            <p>Для завершения регистрации перейдите по ссылке:</p>
            <p>Перейдите по ссылке:</p>
            <p>Или вставьте в адресную строку браузера:</p>
            <a href="http://localhost:3000/auth/authorise/?token=${token}">localhost:3000/auth/authorise/?token=${token}</a>
            <p>localhost:3000/auth/authorise/?token=${token}</p>
            <p>Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.</p>
            <p>С уважением, администрация сайта.</p>
        `;
    }

    /**
     * template for login email that will be sent to user
     * @param user 
     * @param token 
     * @returns 
     */
    public async mailTemplateLogin(user: User, token: string): Promise<string> {
        return `
            <h2>Здравствуйте, ${user.name}!</h2>
            <p>Для входа в сервис:</p>
            <p>Перейдите по ссылке:</p>
            <p>Или вставьте в адресную строку браузера:</p>
            <a href="http://localhost:3000/auth/authorise/?token=${token}">localhost:3000/auth/authorise/?token=${token}</a>
            <p>localhost:3000/auth/authorise/?token=${token}</p>
            <p>Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.</p>
            <p>С уважением, администрация сайта.</p>
        `;
    }
}

export default new MailerService;