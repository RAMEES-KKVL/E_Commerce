const productModel = require("../model/productModel")
const bannerModel = require("../model/bannerModel")
const categoryModel = require("../model/categoryModel")
const wishlistModel = require("../model/wishlistModel")
const cartModel = require("../model/cartModel")
const userProfileModel = require("../model/userProfileModel")
const signupModel = require("../model/signupModel")
const fs = require("fs")

const { Types } = require('mongoose')



exports.get_home = async (req,res)=>{
    try {
        const userId = req.session.user_id
        const Tshirts = await productModel.find({subCategory:"T-shirts"})
        const Shirts = await productModel.find({subCategory:"Shirts"})
        const Shoes = await productModel.find({subCategory:"Shoes"})
        const Sarees = await productModel.find({subCategory:"Sarees"})
        const Tops = await productModel.find({subCategory:"Tops"})
        const Pants = await productModel.find({subCategory:"Pants"})
        const wishlist = await wishlistModel.findOne({userId})
        const categories = await categoryModel.find()
        const cart = await cartModel.findOne({userId})
        res.render("user/pages/userHome", {Tshirts, Shirts, Shoes, Sarees, Tops, Pants, wishlist, categories, cart})
    } catch (error) {
        console.log(error);
    }
}
  




exports.get_product = async (req,res)=>{
    try {
        const id = req.query.product_id
        const product = await productModel.findOne({_id:id})
        const cart = await cartModel.findOne({userId : req.session.user_id})
        const relatedProducts = await productModel.find({subCategory : product.subCategory})
        const wishlist = await wishlistModel.findOne({userId : req.session.user_id})
        res.render("user/pages/productView", {product, cart, relatedProducts, wishlist})
    } catch (error) {
        console.log(error);
    }
}























exports.get_category = async (req,res)=>{
    try {
        const categories = await categoryModel.find()
        const category = req.query.category_name
        const categoryProducts = await productModel.find({category: category})
        const wishlist = await wishlistModel.findOne({userId: req.session.user_id})
        const cart = await cartModel.findOne({userId: req.session.user_id})
        res.render("user/pages/productViewByCategory", {categories, categoryProducts, wishlist, cart})
    } catch (error) {
        console.log(error);
    }
}

 

  

exports.get_subcategory = async (req,res)=>{
    try {
        const subCategory = req.query.subcategory_Id
        const products = await productModel.find({subCategory})
        const categories = await categoryModel.find()
        const wishlist = await wishlistModel.findOne({userId: req.session.user_id})
        const cart = await cartModel.findOne({userId: req.session.user_id})
        res.render("user/pages/productViewBysubCategory", {categories, products, wishlist, cart})
    } catch (error) {
      console.log(error);  
    }
}





exports.get_profile = async (req,res)=>{
    try {
        if(req.session.user_id){
            const userProfile = await userProfileModel.findOne({userId : req.session.user_id})
            const signupData = await signupModel.findOne({_id : req.session.user_id})
            res.render("user/pages/userProfile",{userProfile, signupData}) 
        }else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
    }
}





exports.post_profile = async (req,res)=>{
    try {
        if(req.session.user_id){
            const { 
                username, 
                firstname, 
                lastname, 
                email, 
                mobile, 
                DOB, 
                state, 
                country, 
                district, 
                zip, 
                landmark, 
                address 
            } = req.body
            const profileImage = req.file ? req.file.filename : ""
            
            if(!username || !firstname || !lastname || !email || !mobile || !DOB || !state || !country || !district || !zip || !landmark || !address){
                return res.status(299).json({ success : false, missingData : true })
            }else{
                const updated = await signupModel.findOneAndUpdate(
                    {_id : req.session.user_id},
                    {$set : {
                        username,
                        email,
                        phone : mobile
                    }}
                )

                const userId = new Types.ObjectId(req.session.user_id)
                const newSchema = await userProfileModel({
                    userId,
                    firstname,
                    lastname, 
                    DOB, 
                    state, 
                    country, 
                    district, 
                    zip, 
                    landmark, 
                    address,
                    profileImage
                })
                const added = await newSchema.save()

                if(added && updated){
                    return res.status(200).json({ success : true }) 
                }else{
                    return res.status(289).json({ success : false, failedSave : true})
                }
            }
        }else{
            return res.status(290).json({success : false, noUser : true})
        }
    } catch (error) {
        console.log(error);
    }
}





exports.get_edit_address = async (req,res)=>{
    try {
        const userId = req.query.userId
        const userProfile = await userProfileModel.findOne({userId})
        const signupData = await signupModel.findOne({_id : userId})
        res.render("user/pages/userEditProfile", {userProfile, signupData})
    } catch (error) {
        console.log(error);
    }
}





exports.patch_edit_address = async (req,res)=>{
    try {
        const oldProfile = await userProfileModel.findOne({userId : req.session.user_id})
        const { 
            username, 
            firstname, 
            lastname, 
            email, 
            phone, 
            DOB, 
            state, 
            country, 
            district, 
            zip, 
            landmark, 
            address 
        } = req.body
        const profileImage = req.file ? req.file.filename : oldProfile.profileImage

        if(req.file){
            const update = await signupModel.findOneAndUpdate(
                {_id : req.session.user_id},{
                    $set : {
                        username,
                        email,
                        phone 
                    }
                }
            )
            const updated = await userProfileModel.findOneAndUpdate(
                {userId : req.session.user_id},
                {$set : {
                    firstname, 
                    lastname,
                    DOB, 
                    state, 
                    country, 
                    district, 
                    zip, 
                    landmark, 
                    address,
                    profileImage
                }}
            )
            if(update && updated){
                fs.unlinkSync(`./public/uploads/profile/${oldProfile.profileImage}`)
                return res.status(200).json({success : true, newImg : true})
            }else{
                return res.status(289).json({success : false})
            }
        }else{
            const update = await signupModel.findOneAndUpdate(
                {_id : req.session.user_id},{
                    $set : {
                        username,
                        email,
                        phone 
                    }
                }
            )
            const updated = await userProfileModel.findOneAndUpdate(
                {userId : req.session.user_id},
                {$set : {
                    firstname, 
                    lastname,
                    DOB, 
                    state, 
                    country, 
                    district, 
                    zip, 
                    landmark, 
                    address,
                    profileImage
                }}
            )
            if(update && updated){
                return res.status(200).json({success : true, oldImg : true})
            }
        }
    } catch (error) {
        console.log(error);
    }
}





exports.get_orders = async (req,res)=>{
    try {
        res.render("user/pages/orders")
    } catch (error) {
        console.log(error);
    }
}





exports.get_checkout = (req,res)=>{}





exports.post_checkout = (req,res)=>{}





exports.get_payment = (req,res)=>{}





exports.post_payment = (req,res)=>{}





exports.get_logout = (req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            console.log("Could't destroy UserSession ", error.message);
        }else{
            res.redirect("/login")
        }
    })
}




