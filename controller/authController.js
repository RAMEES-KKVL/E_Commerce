const bcrypt = require("bcrypt")
const signupModel = require("../model/signupModel")
const emailFunction = require("../utilities/email")
const nodemailer = require("nodemailer")
const adminSignupModel = require("../model/adminSignupModel")

const adminSecretKey = process.env.adminSecretKey
const authToken = process.env.authToken
const accountSid = process.env.accountSid
const verifySid = process.env.verifySid
const client = require("twilio")( accountSid, authToken )




// USER CONTROLLER - SIGNUP

exports.get_signup = (req,res)=>{
    res.status(200),res.render("user/pages/signupbody")
}

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
        const userExist = signupDatas.find( val => val.email === email && val.verified === true || val.phone == phone && val.verified === true )
        const notVerified = signupDatas.find( val => val.email === email && val.verified === false || val.phone == phone && val.verified === false )

        if( !username || !email || !phone || !password || !confirmPassword ){  
            return res.status(400).json({success: false, missingdata: true, error: "Please provide required datas"})
        } 
        else if( password !== confirmPassword ){
          return res.status(401).json({success: false, notequlapass: true, error:"Confirm password is not match"})
        }
        else if( userExist ){
           return res.status(409).json({success: false, userExist: true, error: "user already exist"})
        }
        else if( notVerified ){
            const oldUser = notVerified.email === email && notVerified.phone == phone
            if( oldUser ){
                
                await signupModel.findOneAndUpdate({ email, phone },{$set:{ username:username, password:hashedPassword }})

                await client.verify.v2.services.create({friendlyName: "user verification"})
                await client.verify.v2.services(verifySid).verifications.create({to:`+91${phone}`, channel: "sms"})
                .then( otpverification => console.log(otpverification.status))
                
                return res.status(200).json({success: true,phone: phone, notVerified: true})
            }else{
                console.log(3);
                return res.status(409).json({success: false, usernoval: true, error: "Email or Phone already exist"})
            }     
        }
        else{    
            await client.verify.v2.services.create({friendlyName: "user verification"})
            await client.verify.v2.services(verifySid).verifications.create({to:`+91${phone}`, channel: "sms"})
            .then( otpverification => console.log(otpverification.status))
            
            await newSchema.save()
            console.log("Data reached in dATABASE");
            return res.status(200).json({success: true,phone: phone, newUser: true})
        }

    } catch (error) {
        console.log("post signup ", error.message);
    }
}




// USER CONTROLLER - OTP

exports.get_otp = (req,res)=>{
    const phone = req.query.phone
    res.status(200).render("user/pages/otp",{phone})
}

exports.post_otp = async (req,res)=>{
    try {
        const { one, two, three, four, five, six } = req.body
        const otp = one + two + three + four + five + six
        const countryCode = "+91";
        const phone = req.query.phone
        phoneNumberWithCountryCode = countryCode + phone;
       
        let status = false 

        await client.verify.v2.services(verifySid).verificationChecks
        .create({ to:phoneNumberWithCountryCode, code:otp })
        .then( (otpcheck) =>{
            status =  otpcheck.status 
        })
        if(status === "approved"){
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
        const phone = req.query.phone
        console.log(phone);
            await client.verify.v2.services.create({friendlyName: "user verification"})
            await client.verify.v2.services(verifySid).verifications.create({to:`+91${phone}`, channel: "sms"})
            .then( otpverification => console.log(otpverification.status))
             res.status(200).redirect(`/otp`)
    } catch (error) {
        console.log("resend otp get ",error.message);
    }
}
 



// USER CONTROLLER - LOGIN

exports.get_login = (req,res)=>{
    res.status(200).render("user/pages/loginbody")
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
            }else{
                return res.status(243).json({success:false,error:"Invalid Password"})
            }
        }else{
            return res.status(224).json({success:false,error:"User does not exist"})
        }

    } catch (error) {
        console.log("login post ",error.message);
    }
}




// USER CONTROLLER - RESET PASSWORD

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



// USER CONTROLLER - RESET PASSWORD - OTP - EMAIL

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
            await signupModel.findOneAndUpdate({email}, {$set: {password:hashedPassword}})
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





// ADMIN CONTROLLER - SIGNUP

exports.admin_get_signup = (req,res)=>{ 
    res.render("admin/pages/signup")
}

exports.admin_post_signup = async (req,res)=>{ 
    try {
        const { name, email, phone, password, confirmPassword} = req.body
        const hashedPassword = await bcrypt.hash(password,10)

        const newSchema = new adminSignupModel({
            name,
            email,
            phone,
            password : hashedPassword,
            verified : false
        })

        const adminSignupDatas = await adminSignupModel.find()
        const adminExist = adminSignupDatas.find( val => val.email === email && val.verified == true || val.phone == phone && val.verified === true )
        const notVerified = adminSignupDatas.find( val => val.email === email && val.verified === false || val.phone == phone && val.verified === false )

        if( !name || !email || !phone || !password || !confirmPassword ){
            return res.status(280).json({success: false, missingdata: true, error: "Please provide required datas"})
        }
        else if( password !== confirmPassword ){
            return res.status(281).json({success: false, notequlapass: true, error:"Confirm password is not match"})
        }
        else if( adminExist ){
            return res.status(299).json({success: false, adminExist: true, error: "Admin already exist"})
        }
        else if( notVerified ){
            const oldAdmin = notVerified.email === email && notVerified.phone == phone
            if(oldAdmin){
                await adminSignupModel.findOneAndUpdate({ email, phone },{$set:{ name:name, password:hashedPassword }})
                return  res.status(200).json({success: true, notVerified: true , phone: phone})
            }else{
                return res.status(270).json({success: false, adminnoval:true, errorval: "Email or Phone already exist"})
            }
        }else{
            await newSchema.save()
            console.log("Data reached in dATABASE");
            return res.status(200).json({success: true, phone: phone, newAdmin: true})
        }

    } catch (error) {
        console.log("admin signup ",error.message);        
    }  
}




// ADMIN CONTROLLER - SECERT KEY VERIFICATION

exports.admin_get_verification = (req,res)=>{ 
    const email = req.query.email 
    const phone = req.query.phone
    const forget_email = req.query.forget_email
    const error = req.flash("error")
    const rePhone = req.flash("phone")
    const reEmail = req.flash("email")
    res.render("admin/pages/verification",{phone,error,rePhone,email,reEmail,forget_email})
}

exports.admin_post_verification = async (req,res)=>{ 
    try {
        const phone = req.query.phone
        const email = req.query.email
        const forget_email = req.query.forget_email
        const { one, two, three, four, five, six, seven, eight, nine, ten } = req.body
        const secretKey = one + two + three + four + five + six + seven + eight + nine + ten

        if(phone){
            if( adminSecretKey === secretKey ){
                await adminSignupModel.findOneAndUpdate({phone},{$set:{verified:true}})
                res.status(200).redirect("/admin/login")
            }else{
                req.flash("error","Invalid Secret key")
                req.flash("phone",phone)
                res.status(409).redirect("/admin/verification")
            }
        }
        else if(email){
            if( adminSecretKey === secretKey ){
                await adminSignupModel.findOneAndUpdate({email},{$set:{verified:true}})
                res.status(200).redirect("/admin/login")
            }else{
                req.flash("error","Invalid Secret key")
                req.flash("email",email)
                res.status(409).redirect("/admin/verification")
            }
        }
        else if(forget_email){
            if( adminSecretKey === secretKey ){
                res.status(200).redirect(`/admin/reset_password?email=${forget_email}`)
            }else{
                req.flash("error","Invalid Secret key")
                req.flash("forget_email",forget_email)
                res.status(280).redirect("/admin/verification")
            }
        }
    } catch (error) {
        console.log("admin post verification ",error.message);
    }
}




// ADMIN CONTROLLER - LOGIN

exports.admin_get_login = (req,res)=>{
    res.render("admin/pages/login")
}

exports.admin_post_login = async (req,res)=>{
    try {
        const { email, password } = req.body
        const datas = await adminSignupModel.find()
        const adminExist = datas.find( val => val.email === email)

        if(adminExist){
            const comparePass = await bcrypt.compare(password, adminExist.password)
            const verified = adminExist.verified

            if(comparePass){
                if(verified === true){
                    return res.status(200).json({ success:true, admin:true })
                }else{
                    return res.status(200).json({success:true, verification:true, email:email})
                }
            }else{
                return res.status(243).json({success:false, invalidPass:true, error : "Invalid Password"})
            }
        }else{
            return res.status(224).json({success:false, noAdmin:true, error : "Admin does not exist"})
        }      
    } catch (error) {
        console.log("admin login post ",error.message);
    }
}





// ADMIN CONTROLLER -RESET PASSWORD

exports.admin_get_reset_pass = (req,res)=>{
    const email = req.query.email
    res.status(200).render("admin/pages/resetPass",{email})
}

exports.admin_post_reset_pass = async (req,res)=>{
    try {
        const email = req.query.email
        const { password, confirmPassword } = req.body
        const hashedPassword = await bcrypt.hash(password,10)
        const admin = await adminSignupModel.findOne({email})

        if( admin && password === confirmPassword){
            await adminSignupModel.findOneAndUpdate({email}, {$set: {password:hashedPassword}})
            return res.status(200).json({success: true})
        }
        else if(admin && password !== confirmPassword){
            return res.status(250).json({success:false, passNoMatch:true, error: " password does not match"})
        }else{
            return res.status(299).json({success: false, error:"Server does not responding, try again later...!"})
        }

    } catch (error) {
        console.log("admin reset pass post ",error.message);
    }
}

exports.admin_get_forget_Password = (req,res)=>{ 
    res.render("admin/pages/forgetPass")
}

exports.admin_post_forget_Password = async (req,res)=>{ 
    try {
        const {email} = req.body
        const admin = await adminSignupModel.findOne({email:email})

        if(admin){
            return res.status(200).json({success:true, email})
        }else if(!admin){
            return res.status(259).json({success:false, error:"Admin not found"})
        }
        
    } catch (error) {
        console.log("admin reset post ",error.message);
    }
}