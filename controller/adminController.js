const signupModel = require("../model/signupModel")
const categoryModel = require("../model/categoryModel")
const { json } = require("express")


exports.admin_get_Home = (req,res)=>{
    res.render("admin/pages/dashboard")
}



exports.admin_get_userList = async (req,res)=>{
    try {
        const users = await signupModel.find()
        res.render("admin/pages/users",{users})
    } catch (error) {
        console.log("get userlist ",error.message);
    }
}



exports.admin_delete_user = async (req,res)=>{
    try {
        const user_id = req.params.user_id
        const noUser = await signupModel.deleteOne({_id:user_id})
        if(noUser){
            res.status(200).json({success:true})
        }else{
            res.status(299).json({success:false})
        }
    } catch (error) {
        console.log("delete user ",error.message);
    }
}



exports.admin_get_products = (req,res)=>{
    res.render("admin/pages/products")
}



exports.admin_get_addProduct = (req,res)=>{
    res.render("admin/pages/addProduct")
}



exports.admin_post_addProduct = async (req,res)=>{
    try {
        const {productName, price, discount, stock, category, subCategory, deliveryDate, colour, size, description} = req.body
        const productImage = req.file.filename

        if(!productName || !price || !discount || !stock || !category || !subCategory || !deliveryDate || !colour || !size || !description || !productImage){
            res.status(278).json({success:false, missingField:true, error:"Fill all fields"})
        }
        else{
            res.status(200).json({success:true})
        }
    } catch (error) {
        console.log("server side - add product ",error.message);
    }
}




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







// const subCategoryArray = []
exports.admin_get_addCategory = (req,res)=>{
    res.render("admin/pages/addCategory")
}

// exports.admin_post_subcategory = async (req,res)=>{
    // try {
    //     const {subcategoryArray} = req.body
    //     console.log(subcategoryArray);
    //     if(subcategoryArray){
    //         subCategoryArray.push(subCategory)
    //         console.log(subCategoryArray);
    //         return res.status(200).json({success:true})
    //     }
    // } catch (error) {
    //     console.log("subCat ",error);
    // }
// }

exports.admin_post_addCategory = async (req,res)=>{
    try{
        const { category, subCategory} = req.body
        const categoryImage = req.file.filename
        console.log(subCategory);
        const subCategoryArray = JSON.parse(subCategory)
        // const subCategoryArray = subCategory.map((val)=>{
        //     val
        // }) 
        const categories = await categoryModel.find()
        const existCategory = categories.find( val => val.category === category)
        if(!category || !categoryImage){
            return res.status(294).json({ success:false, missingData:true, errorMsg:"Please provide missing datas"})
        }
        else if(existCategory){
            return res.status(289).json({success:false, exist:true, errorMsg:"Category already exist"})
        }
        else if(category && categoryImage && subCategory){
            const newSchema = new categoryModel({
                category,
                categoryImage,
                subCategory : subCategoryArray
            })
            await newSchema.save()
            return res.status(200).json({ success:true, allData:true })
        }
        else if(category && categoryImage && !subCategory){
            const newSchema = new categoryModel({
                category,
                categoryImage
            })
            await newSchema.save()
            console.log("hello");
            return res.status(200).json({ success:true, data:true })
        }
    } catch (error){
        console.log("category post ",error.message);
    }
}









































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



 