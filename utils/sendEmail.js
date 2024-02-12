require("dotenv").config();

const nodemailer = require("nodemailer");

const nodemailreConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailreConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "saykodmytro@meta.ua" };
  await transport
    .sendMail(email)
    .then(() => {
      console.log("Email send success");
    })
    .catch((error) => console.log(error.message));
  return true;
};

module.exports = sendEmail;
