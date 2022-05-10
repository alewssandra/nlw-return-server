import { prisma } from './prisma';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();

app.use(express.json());

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6f11921b936c1b",
      pass: "7331abf4ee99c2"
    }
  });

app.post('/feedbacks', async (req, res) => {
    const { type, comment, screenshot } = req.body;
    
   const feedback = await prisma.feedback.create({
        data: {
            type,
            comment,
            screenshot,
        }
    })

  await transport.sendMail({
      from: 'Equipe Feedget <oi@feedget.com>',
      to: 'Alessandra Lima <lalesandra22@gmail.com>',
      subject: 'Feedback do usuário',
      html: [
        `<p>Tipo do feedback ${type}</p>`,
        `<p>${comment}</p>`,
      ].join('\n'),
    })

    return res.status(201).json({ data: feedback });
})

app.listen(3333, () => {
    console.log('Server started on port 3333');
})