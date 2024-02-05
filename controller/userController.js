// const flash = require("connect-flash")
const bcrypt = require("bcrypt")
// const twilio = require("twilio")
const axios =require("axios")

const nodemailer = require("nodemailer")
const signupModel = require("../model/signupModel")
const emailFunction = require("../middlewares/email")





 
exports.get_signup = (req,res)=>{
    res.status(200),res.render("user/pages/signupbody")
}




const authToken = process.env.authToken
const accountSid = process.env.accountSid
const verifySid = process.env.verifySid
const client = require("twilio")( accountSid, authToken )

  
exports.post_signup = async (req,res)=>{
    try {
        const { username, email, phone, password, confirmPassword} = req.body
        const hashedPassword = await bcrypt.hash(password,10)

        const newSchema = new signupModel({
            username,
            email,
            phone,
            password : hashedPassword,
            verified : false
        })
        


        const signupDatas = await signupModel.find()
        const userExist = signupDatas.find( val => val.email === email && val.verified === true || val.phone === phone && val.verified === true )
        const notVerified = signupDatas.find( val => val.email === email && val.verified === false || val.phone === phone && val.verified === false )

        if( !username || !email || !phone || !password || !confirmPassword ){      
           return res.status(400).json({success: false, missingdata: true, error: "Please provide required datas"})
        } 
        
       else if( password !== confirmPassword ){
            res.status(401).json({success: false, notequlapass: true, error:"Confirm password is not match"})
        }
        else if( userExist ){
             res.status(409).json({success: false, userExist: true, error: "user already exist"})
         }
       else if( notVerified ){

                await client.verify.v2.services.create({friendlyName: "user verification"})
                await client.verify.v2.services(verifySid).verifications.create({to:`+91${phone}`, channel: "sms"})
                .then( otpverification => console.log(otpverification.status))
                
                await signupModel.findOneAndUpdate({ email, phone },{$set:{ username:username, password:hashedPassword }})
                res.status(200).json({success: true,phone: phone, notVerified: true})
         }
          else{    

                await client.verify.v2.services.create({friendlyName: "user verification"})
                await client.verify.v2.services(verifySid).verifications.create({to:`+91${phone}`, channel: "sms"})
                .then( otpverification => console.log(otpverification.status))
    
                await newSchema.save()
                console.log("Data reached in  dATABASE");
                res.status(200).json({success: true,phone: phone, newUser: true})

          }

    } catch (error) {
        console.log("post signup ", error.message);
    }
}

 




exports.get_otp = (req,res)=>{
    const phone = req.params.phone
        res.status(200).render("user/pages/otp",{phone})
}

 



exports.post_otp = async (req,res)=>{
    try {
        const { one, two, three, four, five, six } = req.body
        const otp = one + two + three + four + five + six
        const countryCode = "+91";
        const phone = req.params.phone
        phoneNumberWithCountryCode = countryCode + phone;
       
        let status = false 

        await client.verify.v2.services(verifySid).verificationChecks
        .create({ to:phoneNumberWithCountryCode, code:otp })
        .then( (otpcheck) =>{
            status =  otpcheck.status 
        })
        if(status === "approved"){
            const userDatas = signupModel.findOne({phone:phone})
           await signupModel.findOneAndUpdate({phone},{$set:{verified:true}})
            
            return res.status(200).json({success: true})
        
        }else{
            return res.status(400).json({success: false, error: "Invalid otp"})
        }
     
    } catch (error) {
        console.log("post otp ", error.message);
    }
     
}  
 



exports.get_resend_otp = async (req,res)=>{
    try {
        const phone = req.params.phone
        console.log(phone);
            await client.verify.v2.services.create({friendlyName: "user verification"})
            await client.verify.v2.services(verifySid).verifications.create({to:`+91${phone}`, channel: "sms"})
            .then( otpverification => console.log(otpverification.status))
            req.flash("phone", phone)
             res.status(200).redirect("/otp/:phone")
    } catch (error) {
        console.log("resend otp get ",error.message);
    }
}
 







exports.get_login = async (req,res)=>{
    try {
        res.status(200).render("user/pages/loginbody")
        
    } catch (error) {
        
    }
}    
  



 




exports.post_login = async (req,res)=>{
    try {
        
        const { email, password } = req.body
        const users = await signupModel.find()
        const userExist =  users.find( val => val.email === email)
        const phone = userExist.phone
        
        if( userExist ){
            const comparePass = await bcrypt.compare(password, userExist.password)
            const verified = userExist.verified
            if ( comparePass ) {
                if( verified === true ){

                   return res.status(200).json({success: true, user: true})
                }
                else{
                    await client.verify.v2.services.create({friendlyName: "user verification"})
                    await client.verify.v2.services(verifySid).verifications.create({to:`+91${phone}`, channel: "sms"})
                    .then( otpverification => console.log(otpverification.status))
                    return res.status(200).json({success: true, otp: true, phone})
                }
            }
            else{
                
                return res.status(243).json({success:false,error:"Invalid Password"})
            }
        }
        else{
            return res.status(224).json({success:false,error:"User does not exist"})
        }

    } catch (error) {
        console.log("login post ",error.message);
    }
}





 


exports.get_forget_Password = (req,res)=>{
    res.status(200).render("user/pages/forgetPass")
}

let otp
exports.post_forget_Password = async (req,res)=>{

    try {
        const { email } = req.body;
        
        const user = await signupModel.findOne({ email: email });
        
        if (!user) {
            return res.status(294).json({success:false,error:"User not found"});
        }else{
            
            otp = Math.floor(100000 + Math.random() * 900000);
            
            emailFunction(email, otp);
                return res.status(200).json({success: true})
        }

    } catch (error) {
        console.error("Error in forget password ");
    }

}
 




 
exports.get_forget_Password_otp = (req,res)=>{
    res.status(200).render("user/pages/forgetPassOtp")

}


exports.post_forget_Password_otp = async (req,res)=>{ 
    try {

        const { one, two, three, four, five, six } = req.body
        const userOtp = one + two + three + four + five + six
  
        if(otp == userOtp){

           return res.status(200).json({success: true})
        }
        else{
            return res.status(290).json({success: false,error:"Invalid otp"})
        }
    } catch (error) {
        console.log(error.message);
    }
}



 



exports.get_reset_Password = (req,res)=>{
    res.status(200).render("user/pages/resetPass")
}





exports.post_reset_Password = async (req,res)=>{
    try {
        const email = req.query.email
        const { password, confirmPassword } = req.body
        const hashedPassword = await bcrypt.hash(password,10)

        const user = await signupModel.findOne({email})

        if( user && password === confirmPassword){
            await signupModel.findOneAndUpdate({email,email}, {$set: {password:hashedPassword}})
            console.log("success update password");
            return res.status(200).json({success: true})
        }
        else{
            return res.status(299).json({success: false, error:"Server does not responding, try again later...!"})
        }
 

    } catch (error) {
        console.log("reset post ", error.message);
    }
}





exports.get_home = (req,res)=>{
    res.send("hiii")
}





exports.get_product = (req,res)=>{}





exports.get_cart = (req,res)=>{}





exports.delete_cart_Item = (req,res)=>{}





exports.get_wishlist = (req,res)=>{}





exports.delete_wishlist_Item = (req,res)=>{}





exports.get_category = (req,res)=>{}





exports.get_account = (req,res)=>{}





exports.post_profile = (req,res)=>{}





exports.get_address = (req,res)=>{}





exports.post_address = (req,res)=>{}





exports.get_orders = (req,res)=>{}





exports.get_checkout = (req,res)=>{}





exports.post_checkout = (req,res)=>{}





exports.get_payment = (req,res)=>{}





exports.post_payment = (req,res)=>{}





exports.get_logout = (req,res)=>{}




