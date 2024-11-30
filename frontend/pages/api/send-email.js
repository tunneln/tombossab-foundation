import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, message, job, dob, address } = req.body;

    try {
      const transporter = nodemailer.createTransport({
        service: process.env.REACT_APP_EMAIL_HOST, 
        port: 465,
        secure: true,
        auth: {
          user: process.env.REACT_APP_EMAIL_USER,
          pass: process.env.REACT_APP_EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: email,
        to: process.env.REACT_APP_EMAIL_USER,
        subject: `New message from ${name} (${dob}) | ${phone} | ${job} | ${address} `,
        text: message,
      });

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending email', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
