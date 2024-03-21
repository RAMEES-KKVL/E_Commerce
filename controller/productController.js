const productModel = require("../model/productModel")
const categoryModel = require("../model/categoryModel")
const fs = require("fs")

//----------------------------- ADMIN CONTROLLER - PRODUCT SECTION -------------------------------
exports.admin_get_products = async (req,res)=>{
    try {
        const productList = await productModel.find()
        const length = productList.length
        const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1
        let pageLimit = 0
        if(pageNumber > 1){
            pageLimit = (pageNumber - 1) * 8
        }
        const products = await productModel.aggregate([
            {
                $skip : pageLimit
            },
            {
                $limit : 8
            }
        ])
        res.render("admin/pages/products", {products, length})
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

exports.admin_get_editProduct = async (req,res)=>{
    try {
        const productId = req.query.product_id
        const category = await categoryModel.find()
        const product = await productModel.findOne({_id:productId})
        res.render("admin/pages/editProduct", {category, product})
    } catch (error) {
        console.log(error);
    }
}

exports.admin_patch_editProduct = async (req,res)=>{
    try {
        const productId = req.query.product_id
        const product = await productModel.findOne({_id:productId})
        const {productName, price, discount, stock, category, subCategory, deliveryDate, colour, size, descriptions} = req.body
        const oldImageArray = product.productImage
        const productImage = req.files ? req.files.map((file) => file.filename) : oldImageArray
        
        if(req.files.length == 0){
            const updatedWithOldArray = await productModel.findOneAndUpdate(
                {_id:productId},
                {$set:{ 
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
                }
            });
            if(updatedWithOldArray){
                return res.status(200).json({success: true, oldArray: true})
            }else{
                return res.status(290).json({success: false, oldArray: false})
            }
        }else{
            const updatedWithNewArray = await productModel.findOneAndUpdate(
                {_id:productId},
                {$set:{
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
                }
            })

            if(updatedWithNewArray){
                oldImageArray.forEach(async image =>{
                    await fs.unlinkSync(`./public/uploads/product/${image}`)
                })
                return res.status(200).json({success: true, newArray: true})
            }else{
                return res.status(290).json({success: false, newArray: false})
            }  
        }
    } catch (error) {
        console.log(error);
    }
}

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
