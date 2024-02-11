require("dotenv").config();

const nodemailer = require("nodemailer");

const { META_PASS } = process.env;

const nodemailreConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: { user: "saykodmytro@meta.ua", pass: META_PASS },
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
