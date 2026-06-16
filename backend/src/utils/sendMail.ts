import nodemailer from 'nodemailer';
import config from '../config';

type TSendMail = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: Number(config.SMTP_PORT) === 465,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: TSendMail): Promise<void> => {
  await transporter.sendMail({
    from: `"${config.APP_NAME}" <${config.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
