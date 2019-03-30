const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  //could also use templating services to style the email

  const makeANiceEmail = text => `
    <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
        <h2>Hey!</h2>
        <p>${text}</p>

        <p>✌️Anna</p>
    </div>
  `;

  exports.transport = transport;
  exports.makeANiceEmail = makeANiceEmail;