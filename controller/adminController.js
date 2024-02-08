const bcrypt = require("bcrypt")
// const axios = require("axios")

const nodemailer = require("nodemailer")
const adminSignupModel = require("../model/adminSignupModel")
const emailFunction = require("../middlewares/email")


const adminSecretKey = process.env.adminSecretKey




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



  









exports.admin_get_login = (req,res)=>{
    res.render("admin/pages/login")
}



exports.admin_post_login = async (req,res)=>{
    try {
        console.log(1);
        const { email, password } = req.body
        const datas = await adminSignupModel.find()
        const adminExist = datas.find( val => val.email === email)
        console.log(adminExist);

        if(adminExist){
            console.log(2);
            const comparePass = await bcrypt.compare(password, adminExist.password)
            const verified = adminExist.verified

            if(comparePass){
                console.log(3);
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



exports.admin_get_Home = (req,res)=>{
    res.render("admin/pages/dashboard")
}




exports.admin_get_userList = (req,res)=>{
    res.render("admin/pages/users")
}



exports.admin_delete_user = (req,res)=>{}



exports.admin_get_products = (req,res)=>{
    res.render("admin/pages/products")
}



exports.admin_get_addProduct = (req,res)=>{
    res.render("admin/pages/addProduct")
}



exports.admin_post_addProduct = (req,res)=>{}




exports.admin_get_editProduct = (req,res)=>{
    // res.redirect("/admin/products/add_product")
}




exports.admin_patch_editProduct = (req,res)=>{}




exports.admin_delete_product = (req,res)=>{}





exports.admin_get_orders = (req,res)=>{
    res.render("admin/pages/orders")
}




exports.admin_get_coupons = (req,res)=>{
    res.render("admin/pages/coupons")
}



  


exports.admin_get_addCoupon = (req,res)=>{
    res.render("admin/pages/addCoupon")
}




exports.admin_post_addCoupon = (req,res)=>{}




exports.admin_delete_coupon = (req,res)=>{}





exports.admin_get_category = (req,res)=>{
    res.render("admin/pages/category")
}





exports.admin_get_addCategory = (req,res)=>{
    res.render("admin/pages/addCategory")
}





exports.admin_post_addCategory = (req,res)=>{}







exports.admin_get_editCategory = (req,res)=>{}







exports.admin_patch_editCategory = (req,res)=>{}






exports.admin_delete_category = (req,res)=>{}






exports.admin_get_banners = (req,res)=>{
    res.render("admin/pages/banners")
}





exports.admin_get_addbanner = (req,res)=>{
    res.render("admin/pages/addBanner")
}




exports.admin_get_logout = (req,res)=>{}



 