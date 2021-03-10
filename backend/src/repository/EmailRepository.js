const nodemailer = require('nodemailer');
const { reject } = require('lodash');

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

module.exports = {
  async enviarEmail(dados, req){
    return new Promise(function(resolve, reject) {
      const oauth2Client = new OAuth2(
        "864546315235-lt6ks174h1e7lsn5luqj48oq6ott7jpd.apps.googleusercontent.com",
        "F0E8sy6lT_r5V66Tc_jA06zZ",
        "https://developers.google.com/oauthplayground" // Redirect URL
      );
      oauth2Client.setCredentials({
        refresh_token: "1//04wLOAT5h_oiCCgYIARAAGAQSNwF-L9Ir9cWpXnnINi_8-oobMhB2dz-QAZJiTkEPdwP9qDKCsdK9bnwD9_VOgz-QSKgLtz6ykAo"
      });
      const accessToken = oauth2Client.getAccessToken();

      const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "secretaria@mampituba.com.br",
            clientId: "864546315235-lt6ks174h1e7lsn5luqj48oq6ott7jpd.apps.googleusercontent.com",
            clientSecret: "F0E8sy6lT_r5V66Tc_jA06zZ",
            refreshToken: "1//04wLOAT5h_oiCCgYIARAAGAQSNwF-L9Ir9cWpXnnINi_8-oobMhB2dz-QAZJiTkEPdwP9qDKCsdK9bnwD9_VOgz-QSKgLtz6ykAo",
            accessToken: accessToken
        }
      });
      const mailOptions = {
        from: "secretaria@mampituba.com.br",
        to: dados.email,
        subject: dados.assunto,
        text: dados.mensagem,
        attachments: dados.attachments
      };

      var a = "";
      smtpTransport.sendMail(mailOptions, (error, response) => {
        smtpTransport.close();
        a=error;
        if(error){
          //console.log(error)
          return reject(error);
        }else{
          //console.log("responsee: ",response);
          return resolve(response);
        }
      });
    });
  },
}
