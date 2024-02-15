const productModel = require("../model/productModel")
const categoryModel = require("../model/categoryModel")
const fs = require("fs")



exports.admin_get_products = async (req,res)=>{
    try {
        const products = await productModel.find()
        res.render("admin/pages/products", {products})
    } catch (error) {
        console.log(error);
    }
}



let subCategoryArray=[]
exports.admin_get_subcategory = async (req,res)=>{
    try { 
        const categoryName = req.query.categoryName
        const category = await categoryModel.findOne({category:categoryName})
        if(category){
            const subCategoryStatus = category.subCategory.length > 0
            if(subCategoryStatus){
                subCategoryArray = category.subCategory
                return res.status(200).json({success:true, subCategoryArray})
            }else{
                return res.status(290).json({success:false, noSubCategory:true})
            }
        }
    } catch (error) {
        console.log(error);
    }
}





exports.admin_get_addProduct = async (req,res)=>{
    try {
        const category = await categoryModel.find()

        res.render("admin/pages/addProduct", {category})  
    } catch (error) {
        console.log(error," product_add_get");
    }
}



exports.admin_post_addProduct = async (req,res)=>{
    try {
        const {productName, price, discount, stock, category, subCategory, deliveryDate, colour, size, descriptions} = req.body
        const productImage = req.files.map((file)=>file.filename)
        const exist = await productModel.findOne({productName})
        if(exist){
            return res.status(288).json({success:false})
        }else{
            const newSchema = new productModel({
                productName,
                price,
                discount, 
                stock, 
                category, 
                subCategory,  
                deliveryDate, 
                colour, 
                size, 
                descriptions,
                productImage
            })
            await newSchema.save()

            return res.status(200).json({success:true})
        }
    } catch (error) {
        console.log("server side - add product ",error.message);
    }
}







exports.admin_get_editProduct = (req,res)=>{
    // res.redirect("/admin/products/add_product")
}









exports.admin_patch_editProduct = (req,res)=>{}








// const success = await fs.unlinkSync("./public/uploads/product" + product.productImage)


exports.admin_delete_product = async (req,res)=>{
    try {
        const productId = req.query.productId
        const product = await productModel.findOne({_id:productId})
        if(product){
            const productImages = product.productImage
            productImages.forEach(async image =>{
                await fs.unlinkSync(`./public/uploads/product/${image}`)
            })
            const deleted = await productModel.deleteOne({_id:productId})
            
            if (deleted) {
                return res.status(200).json({success: true})
            }else{
                return res.status(288).json({success: false, deleteIssue: true})
            }
        } else {
            return res.status(299).json({success: false, productIssue: true})
        }
        
    } catch (error) {
        console.log(error); 
    }
}



