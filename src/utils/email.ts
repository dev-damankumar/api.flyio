import nodemailer, { TestAccount } from 'nodemailer';
import sgMail from '@sendgrid/mail';

import { promisify } from 'util';
import { _prod_, email, mockSMTP, sendGridApiKey } from '../constants';

type EmailType = { to: string; subject: string; html: string; cc?: string };
export const send = async ({ to, subject, html, cc = '' }: EmailType) => {
  const mailOptions = {
    from: email.from!,
    to,
    subject,
    html,
    cc,
  };

  if (_prod_ && !mockSMTP) {
    sgMail.setApiKey(sendGridApiKey);
    const info = await sgMail.send(mailOptions);
    console.log('Email Sent!!:', info);
    return;
  }
  const account = await promisify<TestAccount>(nodemailer.createTestAccount)();
  console.log('Test email account created', account);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass, // generated ethereal password
    },
  });

  const info = await transporter.sendMail(mailOptions);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
