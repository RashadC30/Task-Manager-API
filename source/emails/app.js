const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  
  sgMail.send ({
    from: "yosh3655@gmail.com",
    to: email,
    subject: "yo",
    text: `What it do ${name}`
  })
}

const cancellationEmail = (email, name) => {

  sgMail.send ({
    from: "yosh3655@gmail.com",
    to: email,
    subject: "Sorry to see you go",
    text: `We understand that you would like to leave us ${name} but is there anyway we can convince you to stay?`
  })
}

module.exports = {
  sendWelcomeEmail,
  cancellationEmail
}
