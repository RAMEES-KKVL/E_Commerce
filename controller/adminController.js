const signupModel = require("../model/signupModel")
const categoryModel = require("../model/categoryModel")
const couponModel = require("../model/couponModel")
const bannerModel = require("../model/bannerModel")
const fs = require("fs")
// const { json } = require("express")
const orderModel = require("../model/orderModel")
const productModel = require("../model/productModel")


exports.admin_get_Home = (req,res)=>{

    res.render("admin/pages/dashboard")
}


exports.admin_getChart = async (req,res)=>{
    try {
        
        const monthlyData = await signupModel.aggregate([
            {
                $match: {
                    createdat: {
                        $gte: new Date(new Date().getFullYear(), 0, 1), // Start of the current year
                        $lt: new Date(new Date().getFullYear() + 1, 0, 1) // Start of next year
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdat" },
                    count: { $sum: 1 } // Count documents for each month
                }
            },
            {
                $sort: { "_id": 1 } // Sort by month
            }
        ]);

        // Format data for Chart.js
        const chartData = {
            labels: [],
            data: []
        };
        monthlyData.forEach(month => {
            chartData.labels.push(month._id); // Push month number (1-12)
            chartData.data.push(month.count); // Push count for the month
        });

        // const orders = await orderModel.find()
        const results = await orderModel.aggregate([
            {
              $unwind: "$orders", // Deconstruct the orders array
            },
            {
              $group: {
                _id:  { $month: "$orders.orderDate" } , // Group by month
                count: { $sum: 1 }, // Count the number of orders in each month
              },
            },
            
        ])
          

        const products = await productModel.find()
        // Aggregate the data to get the count of products by category
        const productCategories = {};
        products.forEach(product => {
            const category = product.category;
            if (!productCategories[category]) {
                productCategories[category] = 1;
            } else {
                productCategories[category]++;
            }
        });

        return res.status(200).json({success : true, chartData, orderData : results, productData : productCategories})
    } catch (error) {
        console.log(error);
    }
}




exports.admin_get_userList = async (req,res)=>{
    try {
        const users = await signupModel.find()
        res.render("admin/pages/users",{users})
    } catch (error) {
        console.log("get userlist ",error.message);
    }
}


exports.admin_block_userList = async (req,res)=>{
    try {
        const userId = req.query.user_id
        const user = await signupModel.findOne({_id:userId})

        if(user.blocked){
            await signupModel.findOneAndUpdate(
                {
                    _id:userId
                },
                {$set : 
                    {
                        blocked : false
                    }
                }
            )
        }else{
            await signupModel.findOneAndUpdate(
                {
                    _id:userId
                },
                {$set : 
                    {
                        blocked : true
                    }
                }
            )
        }
    } catch (error) {
        console.log(error);
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






exports.admin_get_orders = async (req,res)=>{
    try {
        const orders = await orderModel.find().populate("orders.productId.productId")
        res.render("admin/pages/orders", {orders})
    } catch (error) {
        console.log(error);
    }
}







exports.admin_get_coupons = async (req,res)=>{
    try {
        const coupons = await couponModel.find()
        res.render("admin/pages/coupons", {coupons})
    } catch (error) {
        
    }
}


exports.admin_get_addCoupon = (req,res)=>{
    res.render("admin/pages/addCoupon")
}

exports.admin_post_addCoupon = async (req,res)=>{
    try {
        const { couponName, couponDiscount, minOrderAmount, maxOrderAmount, startingDate, endingDate, availability } = req.body
        const exist = await couponModel.findOne({couponName})
        
        if(exist){
            return res.status(289).json({ success: false })
        }else{
            const newSchema = new couponModel({
                couponName,
                couponDiscount,
                minOrderAmount,
                maxOrderAmount,
                startingDate,
                endingDate,
                availability
            })
            await newSchema.save()
            return res.status(200).json({ success: true })
        }
    } catch (error) {
        console.log(error); 
    }
}


exports.admin_edit_Coupon = async (req,res)=>{
    try {
        const couponId = req.query.couponId
        const coupon = await couponModel.findOne({_id:couponId})
        res.render("admin/pages/editCoupon", {coupon})
    } catch (error) {
        
    }
} 
 

exports.admin_patch_coupon = async (req,res)=>{
    try {
        const {couponName, couponDiscount, minOrderAmount, maxOrderAmount, startingDate, endingDate, availability} = req.body
        const couponId = req.query.couponId
        const couponUpdate = await couponModel.findOneAndUpdate(
            {_id:couponId},
            {$set:{
                couponName,
                couponDiscount,
                minOrderAmount,
                maxOrderAmount,
                startingDate,
                endingDate,
                availability
            }})

        if(couponUpdate){
            return res.status(200).json({success: true})
        }else{
            return res.status(290).json({success: false})
        }
        
    } catch (error) {
        
    }
}







exports.admin_delete_coupon = async (req,res)=>{
    try {
        const couponId = req.query.couponId
        const deleted = await couponModel.deleteOne({_id:couponId})
        
        if(deleted){
            return res.status(200).json({success: true})
        }else{
            return res.status(288).json({success: false})
        }
    } catch (error) {
        console.log(error);
    }
}




















exports.admin_get_category = async (req,res)=>{
    try {
        const category = await categoryModel.find()
        res.render("admin/pages/category", {category})
    } catch (error) {
        console.log("category get ",error);
    }
}








exports.admin_get_addCategory = (req,res)=>{
    res.render("admin/pages/addCategory")
}

exports.admin_post_addCategory = async (req,res)=>{
    try{
        const { category, subCategory} = req.body
        const categoryImage = req.file.filename
        const subCategoryArray = JSON.parse(subCategory)
        const categories = await categoryModel.find()
        const existCategory = categories.find( val => val.category === category)
        if(!category || !categoryImage){
            return res.status(294).json({ success:false, missingData:true, errorMsg:"Please provide missing datas"})
        }
        else if(existCategory){
            return res.status(289).json({success:false, exist:true, errorMsg:"Category already exist"})
        }
        else if(category && categoryImage && subCategoryArray.length > 0){
            const newSchema = new categoryModel({
                category,
                categoryImage,
                subCategory : subCategoryArray
            })
            await newSchema.save()
            return res.status(200).json({ success:true, allData:true })
        }
        else if(category && categoryImage && subCategoryArray.length == 0){
            const newSchema = new categoryModel({
                category,
                categoryImage
            })
            await newSchema.save()
            return res.status(200).json({ success:true, data:true })
        }
    } catch (error){
        console.log("category post ",error.message);
    }
}







exports.admin_get_editCategory = async (req,res)=>{
    try {
        const categoryId = req.query.category_id
        const category = await categoryModel.findOne({_id:categoryId})
        res.render("admin/pages/editCategory", {category})
    } catch (error) {
        console.log(error);
    }
}







exports.admin_patch_editCategory = async (req,res)=>{
    try {
        try{
            const { category, subCategory} = req.body
            const categoryId = req.query.category_id
            const oldCategory = await categoryModel.findOne({_id:categoryId})
            const oldImage = oldCategory.categoryImage
            const categoryImage = req.file ? req.file.filename : oldImage
            const subCategoryArray = subCategory ? JSON.parse(subCategory) : []
            if(!category){
                return res.status(294).json({ success:false, missingData:true, errorMsg:"Please provide category name"})
            }else{
                if(!req.file){
                    if(category && categoryImage && subCategoryArray.length > 0){
                       await categoryModel.updateOne(
                            {_id:categoryId},
                                {      
                                    category,
                                    subCategory : subCategoryArray,
                                    categoryImage
                                }
                            )
                        return res.status(200).json({ success:true, allData:true })
                    }
                    else if(category && categoryImage && subCategoryArray.length == 0){
                       await categoryModel.updateOne(
                            {_id:categoryId},
                                {
                                    category,
                                    subCategory : subCategoryArray,
                                    categoryImage 
                                }
                            )
                        return res.status(200).json({ success:true, data:true })
                    }
                }else{
                    fs.unlinkSync(`./public/uploads/category/${oldImage}`)
                    if(category && categoryImage && subCategoryArray.length > 0){
                      await categoryModel.updateOne(
                            {_id:categoryId},
                                {
                                    category,
                                    subCategory : subCategoryArray,
                                    categoryImage
                                }
                            )
                        return res.status(200).json({ success:true, allData:true })
                    }
                    else if(category && categoryImage && subCategoryArray.length == 0){
                        await categoryModel.updateOne(
                            {_id:categoryId},
                                {
                                    category,
                                    subCategory : subCategoryArray,
                                    categoryImage 
                                }
                            )
                        return res.status(200).json({ success:true, data:true })
                    }
                }
            }
            
        } catch (error){
            console.log("category post ",error.message);
        }
    } catch (error) {
        console.log(error);
    }
}
  


 


exports.admin_delete_category = async (req,res)=>{
    try {
        const categoryId = req.query.categoryId
        const category = await categoryModel.findOne({_id:categoryId})
        if(category){
            const categoryImage = category.categoryImage
            await fs.unlinkSync(`./public/uploads/category/${categoryImage}`)
            const deleted = await categoryModel.deleteOne({_id:categoryId})

            if(deleted){
                res.status(200).json({success: true})
            }else{
                res.status(289).json({success: false})
            }
        }
    
    } catch (error) {
        console.log(error);
    }
}
 
















 



exports.admin_get_banners = async (req,res)=>{
    try {
        const banners = await bannerModel.find()
        res.render("admin/pages/banners", {banners})
    } catch (error) {
        console.log(error);
    }
}





exports.admin_get_addbanner = (req,res)=>{
    res.render("admin/pages/addBanner")
}

exports.admin_post_addbanner = async (req,res)=>{
    try {
        const {bannerName, offerPrice, bannerHeading, startingDate, endingDate} = req.body
        const bannerImage = req.file.filename
        const exist = await bannerModel.findOne({bannerName})
        
        if(exist){
            return res.status(289).json({ success: false })
        }else{
            const newSchema = new bannerModel({
                bannerName,
                offerPrice,
                bannerHeading,
                startingDate,
                endingDate,
                bannerImage
            })
            await newSchema.save()

            return res.status(200).json({ success: true })
        }
    } catch (error) {
        console.log(error);
    }
} 

exports.admin_edit_banner = async (req,res)=>{
    try {
        const bannerId = req.query.bannerId
        const banner = await bannerModel.findOne({_id:bannerId})
        res.render("admin/pages/editBanner", {banner})
    } catch (error) {
        
    } 
}
 
exports.admin_patch_banner = async (req,res)=>{
    try {
        const {bannerName, offerPrice, bannerHeading, startingDate, endingDate} = req.body
        const bannerId = req.query.banner_id
        const oldBanner = await bannerModel.findOne({_id:bannerId}) 
        const oldImage = oldBanner.bannerImage
        const bannerImage = req.file ? req.file.filename : oldImage
        
        if(!req.file){
            const oldupdated = await bannerModel.findOneAndUpdate(
                {_id:bannerId},
                {$set:{
                    bannerName,
                    offerPrice, 
                    bannerHeading, 
                    startingDate, 
                    endingDate, 
                    bannerImage
                }
            })
            
            if(oldupdated){
                return res.status(200).json({success: true, oldimg:true})
            }else{
                return res.status(290).json({success: false, oldimg:false})
            }
            
        }else{
            const updated = await bannerModel.findOneAndUpdate(
                {_id:bannerId},
                {$set:{
                    bannerName, 
                    offerPrice, 
                    bannerHeading, 
                    startingDate, 
                    endingDate, 
                    bannerImage
                }
            })

            if(updated){
                await fs.unlinkSync(`./public/uploads/banner/${oldImage}`)
                return res.status(200).json({success: true, successnew: true})
            }else{
                return res.status(290).json({success: false, successnew: false,})
            }
        }
        
    }catch(error){
        console.log(error);
    }
}

   

  

exports.admin_delete_banners = async (req,res)=>{
    try {
        const bannerId = req.query.bannerId
        const banner = await bannerModel.findOne({_id:bannerId})
        if(banner){
            const bannerImage = banner.bannerImage
            await fs.unlinkSync(`./public/uploads/banner/${bannerImage}`)
            const deleted = await bannerModel.deleteOne({_id:bannerId})
            if(deleted){
                return res.status(200).json({success: true})
            }else{
                return res.status(289).json({success: false})
            }
        }
        
    } catch (error) {
        console.log(error);
    }
}



exports.admin_get_logout = (req,res)=>{}



 