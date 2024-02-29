const nodemailer = require("nodemailer")

const myEmail = process.env.myEmail
const myPassword = process.env.myPassword

const emailFunction = (email,otp)=> {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: myEmail,
          pass: myPassword
        }
      });
         
      var mailOptions = {
        from: myEmail,
        to: email,
        subject: 'Sending otp for resetting password',
        text: 'Your verification otp is '+ otp
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });   
    }
   
 module.exports = emailFunction