const nodemailer = require("nodemailer");

function sendMail({ reciverEmail, message }) {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "decc5f494ef1b3",
        pass: "e8a5ab9bbe7f28",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: reciverEmail,
      subject: 'Fitness App OTP',
      html: `<p> This is  OTP your the fitness application ${message} `,
    };

    return new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { sendMail };
