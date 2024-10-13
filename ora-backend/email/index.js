const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

const config = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.name,
    pass: config.email.password,
  },
});

const sendMail = (emailConfig) =>
  transporter.sendMail(emailConfig, (err, info) => {
    if (err) {
      console.log("Email sending error:");
      console.log(err);
    } else {
      console.log("Email sending info:");
      console.log(info.envelope);
      console.log(info.messageId);
    }
  });

const sendRegistrationMail = ({ to, username }) => {
  const source = fs
    .readFileSync(
      path.resolve(__dirname, "..", "./templates/registration-template.html"),
      // path.resolve(__dirname, "./templates/registration-template.html"),
      "utf-8"
    )
    .toString();
  const template = handlebars.compile(source);
  const replacements = {
    username,
  };
  const htmlToSend = template(replacements);

  sendMail({
    sender: "ORA-Email Service",
    subject: "Регистрация ora-beauty.by",
    to,
    text: "", // при отправке html смысловой нагрузки не несёт, но рекомендуют оставлять
    html: htmlToSend,
  });
};

const sendPasswordRestorationMail = ({ to, href }) => {
  const source = fs
    .readFileSync(
      path.resolve(__dirname, "..", "./templates/password-restoration-template.html"),
      // path.resolve(__dirname, "./templates/password-restoration-template.html"),
      "utf-8"
    )
    .toString();
  const template = handlebars.compile(source);
  const replacements = {
    href,
  };
  const htmlToSend = template(replacements);

  sendMail({
    sender: "ORA-Email Service",
    subject: "Обновление пароля учётной записи ora-beauty.by",
    to,
    text: "", // при отправке html смысловой нагрузки не несёт, но рекомендуют оставлять
    html: htmlToSend,
  });
};

module.exports = { sendRegistrationMail, sendPasswordRestorationMail };
