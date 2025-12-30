import nodemailer from 'nodemailer';

const sendEmail= async ({ to, subject, html })=>{
    const transporter=nodemailer.createTransport({
        port: Number(process.env.EMAIL_PORT),
        host: process.env.EMAIL_HOST,
        secure: false,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.verify();

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    })
}

export default sendEmail;