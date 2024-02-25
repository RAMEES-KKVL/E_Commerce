const productModel = require("../model/productModel")
const bannerModel = require("../model/bannerModel")
const categoryModel = require("../model/categoryModel")
const wishlistModel = require("../model/wishlistModel")





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
        res.render("user/pages/userHome", {Tshirts, Shirts, Shoes, Sarees, Tops, Pants, wishlist, categories})
    } catch (error) {
        console.log(error);
    }
}
  




exports.get_product = async (req,res)=>{
    try {
        const id = req.query.product_id
        const product = await productModel.findOne({_id:id})
        res.render("user/pages/productView", {product})
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
        res.render("user/pages/productViewByCategory", {categories, categoryProducts, wishlist})
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
        res.render("user/pages/productViewBysubCategory", {categories, products, wishlist})
    } catch (error) {
      console.log(error);  
    }
}





exports.get_profile = (req,res)=>{
    res.render("user/pages/userProfile")
}





exports.post_profile = (req,res)=>{}





exports.get_edit_address = (req,res)=>{
    res.render("user/pages/userEditProfile")
}





exports.post_edit_address = (req,res)=>{}





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




