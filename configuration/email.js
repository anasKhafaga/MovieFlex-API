/**
 * Sending emails
 * @module configuration/email
 */

const sgMail = require('@sendgrid/mail');

/**
 * @function sendingEmails
 * @param {string} email - user email
 * @param {string} username - user username
 * @param {string} token - verification token
 */
module.exports = (email, username, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    from: process.env.FROM,
    to: email,
    subject: 'Welcome to our movie app community',
    html: `
      <div style="  box-sizing: border-box;
  background-color: #282c34;
  font-size: calc(10px + 2vmin);
  color: white;
  width: 70%;
  margin-left: 15%;
  padding: 2em;
  font-family: sans-serif;
  line-height: 2;">
    <h1 style=" color:#f3c63f; text-align: center;">movieFlex</h1>
    <h3>Verify your email address</h3>
    <p style="font-size: 0.7em;">Please confirm that you want to use this as your movieFlex account email address.</p>
    <a
          href='${process.env.REACT_APP_URI}/verify/${token}'
          class="btnLink"
        >
          <input type="submit" value="Verify my email address" style="  border: .05em solid #f0ba18;
            border-radius: 0.4em;
            color: #f0ba18;
            outline: none;
            background-color: rgba(255, 255, 255, 0);
            padding: 1em 2em 1em;
            height: 3em;
            font-size: 1.1em;
            cursor: pointer;
            transition: width 0.1s;
  width: 100%;"></input>
    </a>
    <div class="mainFooter">
          <div>
            <p style="font-size: 0.5em; text-align: center;">©2018-2021 | Anas Khafaga</p>
          </div>
        </div>
  </div>
    `,
  };

  sgMail.send(msg);
};
