const nodemailer = require("nodemailer")

const myEmail = process.env.myEmail
const myPassword = process.env.myPassword

const emailCOD = (email, otp)=>{

    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : myEmail,
            pass : myPassword
        }
    })

    const mailOptions = {
        from : myEmail,
        to : email,
        subject : "Sending otp for confirming order",
        text : "Your verification otp is " + otp
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Emaail sent : " + info.response);
        }
    })
}

module.exports = emailCOD