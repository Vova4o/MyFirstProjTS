import nodemailer from 'nodemailer';
import { User } from '@prisma/client';

// Создание транспортера с использованием SMTP
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT || '1025'),
//     secure: process.env.SMTP_SECURE === 'false', // true для 465, false для других портов
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     },
//     tls: {
//         ciphers:'SSLv3'
//     }
// });

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false, // use TLS
    auth: {
      user: "username",
      pass: "pass",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
      ciphers:'SSLv3'
    },
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

    // <a href="${process.env.CLIENT_URL}/auth/activate/${token}">Подтвердить email</a>
    
    public async mailTemplate(user: User, token: string): Promise<string> {
        return `
            <h2>Здравствуйте, ${user.name}!</h2>
            <p>Для завершения регистрации перейдите по ссылке:</p>
            
            <p>Или вставьте в адресную строку браузера:</p>
            <a href="http://localhost:3000/auth/login/?token=${token}">localhost:3000/auth/login/?token=${token}</a>
            <p>localhost:3000/auth/login/?token=${token}</p>
            <p>Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.</p>
            <p>С уважением, администрация сайта.</p>
        `;
    }
}

export default new MailerService;