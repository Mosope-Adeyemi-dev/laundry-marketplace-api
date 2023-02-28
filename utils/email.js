const transporter = require('../config/nodemailerTransporter')

const sendMail = async (type, token, email) => {
  let message;
  switch (type) {
    case 'adminInvite':
      message = {
        from: `Laundrun Services Team" ${process.env.MAIL_USERNAME}`,
        to: email,
        subject: `You've been invited! ${email.split('@')[0]}!`,
        html: ` 
            <h2>
              Hello, you've been invited to join the Laundrun platform as an admin
            </h2>
              <br>
              <h3>
                Here's you invite code: ${token}
              </h3>
              <p>Valid for 10 minutes </p>
        `,
      }
      break;

    default:
      break;
  }

  try {
    const info = transporter.sendMail(message)
    console.log(info)
  } catch (error) {
    console.error(error)
  }
}

module.exports = sendMail;
