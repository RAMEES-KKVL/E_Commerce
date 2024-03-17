const productModel = require("../model/productModel")
const bannerModel = require("../model/bannerModel")
const categoryModel = require("../model/categoryModel")
const wishlistModel = require("../model/wishlistModel")
const cartModel = require("../model/cartModel")
const userProfileModel = require("../model/userProfileModel")
const signupModel = require("../model/signupModel")
const couponModel = require("../model/couponModel")
const orderModel = require("../model/orderModel")
const fs = require("fs")
const Razorpay = require("razorpay")
const { Types, default: mongoose } = require('mongoose')
const emailCOD = require("../utilities/emailCOD")

const keyId = process.env.keyId
const keySecret = process.env.keySecret

//----------------------------- USER CONTROLLER - HOME SECTION -------------------------------
exports.get_home = async (req,res)=>{
    try {
        const banners = await bannerModel.find()
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
        res.render("user/pages/userHome", {banners, Tshirts, Shirts, Shoes, Sarees, Tops, Pants, wishlist, categories, cart})
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

exports.get_allProducts = async (req,res)=>{
    try {
        let products = []
        const currentFilter = req.query ? req.query.category ? req.query.category :  req.query.range : "" 
        const wishlist = await wishlistModel.findOne({userid : req.session.user_id})
        const cart = await cartModel.findOne({userid : req.session.user_id})

        if(req.query.category){      // FILTERING PRODUCTS
            const category = req.query.category
            if(category === "all"){
                products = await productModel.find()
            }
            else if(category == 500){
                products = await productModel.find(
                    {
                        $expr : {
                            $lt : [
                                {
                                    $subtract : [
                                        "$price" , "$discount"
                                    ]
                                }, 500
                            ]
                        }
                    }
                )
            }
            else if(category == 1000){
                products = await productModel.find(
                    {
                        $expr : {
                            $and : [
                                { $gte : [{ $subtract: ["$price", "$discount"] }, 500] },
                                { $lt : [{ $subtract: ["$price", "$discount"] }, 1000] }
                            ]
                        }
                    }
                )
            }
            else if(category == 1500){
                products = await productModel.find(
                    {
                        $expr : {
                            $and : [
                                { $gte : [{ $subtract: ["$price", "$discount"] }, 1000] },
                                { $lt : [{ $subtract: ["$price", "$discount"] }, 1500] }
                            ]
                        }
                    }
                )
            }
            else if(category == 2500){
                products = await productModel.find(
                    {
                        $expr : {
                            $and : [
                                { $gte : [{ $subtract: ["$price", "$discount"] }, 1500] },
                                { $lt : [{ $subtract: ["$price", "$discount"] }, 2500] }
                            ]
                        }
                    }
                )
            }
            else if(category == 3000){
                products = await productModel.find(
                    {
                        $expr : {
                            $gte : [
                                {
                                    $subtract : [
                                        "$price" , "$discount"
                                    ]
                                }, 2500
                            ]
                        }
                    }
                )
            }
            else if(category == 'ff0000'){
                const colour = '#'+category
                products = await productModel.find(
                    {
                        colour : colour
                    }
                )
            }
            else if(category == '00ff00'){
                const colour = '#'+category
                products = await productModel.find(
                    {
                        colour : { $in : [colour] }
                    }
                )
            }
            else if(category == 'ffffff'){
                const colour = '#'+category
                products = await productModel.find(
                    {
                        colour : { $in : [colour] }
                    }
                )
            }
            else if(category == '0000ff'){
                const colour = '#'+category
                products = await productModel.find(
                    {
                        colour : { $in : [colour] }
                    }
                )
            }
            else if(category == 'ffea00'){
                const colour = '#'+category
                products = await productModel.find(
                    {
                        colour : { $in : [colour] }
                    }
                )
            }else{
                const CategoryProducts = await productModel.find({category})
                products = CategoryProducts
            }
        }else if(req.query.range){    // SORTING PRODUCTS
            if(req.query.range === 'Low to High'){
                products = await productModel.find().sort({
                    price : 1
                })
            }else if(req.query.range === 'High to Low'){
                products = await productModel.find().sort({
                    price : -1
                })
            }
        }else if(req.query.search){    // SEARCHING PRODUCTS
            products = await productModel.find(
                {
                    productName : {
                        $regex : req.query.search,
                        $options: 'i'
                    }
                }
            )
        }else{
            products = await productModel.find()
        }
        res.render("user/pages/allProducts", {products, wishlist, cart , currentFilter})
    } catch (error) {
        console.log(error);
    }
}

//----------------------------- CART - WISHLIST COUNT -------------------------------
exports.get_count = async (req,res)=>{
    try {
        const cart = await cartModel.findOne({userId : req.session.user_id})
        const wishlist = await wishlistModel.findOne({userId : req.session.user_id})
        const cartCount = cart ? cart.products.length : 0
        const wishlistCount = wishlist ? wishlist.products.length : 0
        return res.status(200).json({cartCount, wishlistCount})
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  FUNCTION FOR VIEWING SINGLE PRODUCT -------------------------------
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

//------------------------------ STORING USER-PREFERRED PRODUCT SIZE -------------------------------
let checkoutProduct = []
exports.post_product = async (req,res)=>{
    try {
        if(req.query.product_id){
            const productId = req.query.product_id
            const size = req.query.size
            const product = await productModel.findOne({_id : productId})
            const existProduct = checkoutProduct.some(product => product.productId._id === product._id) 

            if(!existProduct){
                const key = {
                    productId : product,
                    size,
                    quantity : 1
                }
                checkoutProduct = [key]
                return res.status(200).json({success : true, single : true, checkoutProduct})
            }
        }else{
            const cartProduct = await cartModel.findOne({userId : req.session.user_id}).populate("products.productId")
            checkoutProduct = cartProduct.products.map(product => product)
            return res.status(200).json({success : true, cart : true, checkoutProduct})
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  USER PROFILE SECTION -------------------------------
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
                phone, 
                DOB, 
                state, 
                country, 
                district, 
                zip, 
                landmark, 
                address 
            } = req.body
            const profileImage = req.file ? req.file.filename : ""
            
            if(!username || !firstname || !lastname || !email || !phone || !DOB || !state || !country || !district || !zip || !landmark || !address){
                return res.status(299).json({ success : false, missingData : true })
            }else{
                const updated = await signupModel.findOneAndUpdate(
                    {_id : req.session.user_id},
                    {$set : {
                        username,
                        email,
                        phone
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
                    profileImage,
                    deliveryAddresses : {
                        firstname, 
                        lastname, 
                        state, 
                        country, 
                        district, 
                        zip,
                        address, 
                        phone
                    }
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
                    profileImage,
                    deliveryAddresses : {
                        firstname, 
                        lastname, 
                        state, 
                        country, 
                        district, 
                        zip,
                        address, 
                        phone
                    }
                }}
            )
            if(update && updated){
                if(oldProfile.profileImage){
                    fs.unlinkSync(`./public/uploads/profile/${oldProfile.profileImage}`)
                    return res.status(200).json({success : true, newImg : true})
                }else{
                    return res.status(200).json({success : true, newImg : true})
                }
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
                    profileImage,
                    deliveryAddresses : {
                        firstname, 
                        lastname, 
                        state, 
                        country, 
                        district, 
                        zip,
                        address, 
                        phone
                    }
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

exports.post_add_deliveryAddress = async (req,res) =>{
    try {
        if(req.session.user_id){
            const arrayExist = userProfileModel.findOne({userId : req.session.user_id})
            if(arrayExist){
                const deliveryAddress = {
                    firstname,
                    lastname,
                    phone,
                    country,
                    state,
                    district,
                    zip,
                    address
                } = req.body.formData
                
                const updated = await userProfileModel.findOneAndUpdate(
                    {userId : req.session.user_id},
                    {
                        $push : {
                            deliveryAddresses : deliveryAddress
                        }
                    }
                )
                if(updated){
                    return res.status(200).json({success : true})
                }else{
                    return res.status(289).json({success : false, noPush : true})
                }
            }else{
                return res.status(279).json({success : false, noArray : true})
            }
        }else{
            return res.status(299).json({success : false, noSession : true})
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  USER ORDER SECTION -------------------------------
exports.get_orders = async (req,res)=>{
    try {
        if(req.session.user_id){
            const userOrder = await orderModel.findOne({userId:req.session.user_id}).populate("orders.productId.productId")
            const orders = userOrder.orders
            res.render('user/pages/orders',{orders})
        }else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
    }
}

exports.get_orderOpen = async (req,res)=>{
    try {
        if(req.session.user_id){
            const {orderId, productId} = req.query
            const userOrders = await orderModel.findOne({userId : req.session.user_id}).populate("orders.productId.productId")
            const order = userOrders.orders.find(order => order._id == orderId)
            const profileDetails = await userProfileModel.findOne({userId : req.session.user_id})
            const address = profileDetails.deliveryAddresses.find(address => address._id == order.deliveryAddress)
            const product = order.productId.find(product => product.productId._id == productId)
            res.render("user/pages/orderOpen", {orderId, product, address})
        }else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  CHECKOUT SECTION -------------------------------
exports.get_checkout = async (req,res)=>{
    try {
        if(req.session.user_id){
            const signupData = await signupModel.findOne({_id : req.session.user_id})
            const profileData = await userProfileModel.findOne({userId : req.session.user_id})
            const coupons = await couponModel.find()
            const address = profileData ? profileData.deliveryAddresses : []
            res.render("user/pages/checkout", {checkoutProduct, signupData, profileData, address, coupons})
        }else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  STORING CHANGED QUANTITY FROM CHECKOUT PAGE -------------------------------
exports.patch_checkout_quantity = async (req,res)=>{
    try {
        const cart = await cartModel.findOne({userId : req.session.user_id})
        if(cart){
            const productId = req.query.product_id
            const productExist = cart.products.some(id => id.productId == productId)
            if(productExist){
                const {value} = req.body
                const updated = await cartModel.findOneAndUpdate(
                    {userId:req.session.user_id, "products.productId" : productId},
                    {$set : 
                        {"products.$.quantity" : value}
                    },
                    {new : true}
                )
                if(updated){
                    checkoutProduct = checkoutProduct.map(product => {
                        if (product.productId._id.toString() === productId.toString()) {
                            product.quantity = value;
                        }
                        return product;
                    });
                    return res.status(200).json({success : true})
                }else{
                    return res.status(200).json({success : true})
                }
            }else{
                return res.status(200).json({nocart : true})
            }
        }else{
            return res.status(250).json({nocart : true,})
        }
        
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  STORING CHANGED SIZE FROM CHECKOUT PAGE -------------------------------
exports.patch_checkout_size = async (req,res)=>{
    try {
        const cart = await cartModel.findOne({userId : req.session.user_id})
        if(cart){
            const productId = req.query.productId
            const productExist = cart.products.some(id => id.productId == productId)
            if(productExist){
                const {size} = req.body
                const updated = await cartModel.findOneAndUpdate(
                    {userId : req.session.user_id, "products.productId" : productId},
                    {$set : 
                        {"products.$size" : size}
                    },
                    {new : true}
                )
                if(updated){
                    checkoutProduct = checkoutProduct.map(product => {
                        if (product.productId._id.toString() === productId.toString()) {
                            product.size = size;
                        }
                        return product;
                    });
                    return res.status(200).json({success : true})
                }else{
                    return res.status(289).json({success : false})
                }
            }else{
                return res.status(256).json({nocart : true})
            }
        }else{
            return res.status(256).json({nocart : true})
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  REMOVING PRODUCT FROM CHECKOUT PAGE -------------------------------
exports.delete_checkout = async (req,res)=>{
    try {
        if(req.session.user_id){
            const product_id = req.query.product_id
            const deleted = await cartModel.findOneAndUpdate(
                {userId : req.session.user_id},{
                    $pull : {
                        products : {productId : product_id}
                    }
                }
            )
            if(deleted){
                checkoutProduct = checkoutProduct.reduce((acc, product) => {
                    if (product.productId._id.toString() !== product_id.toString()) {
                        acc.push(product);
                    }
                    return acc;
                }, [])
                return res.status(200).json({success : true})
            }else{
                return res.status(290).json({success : false})
            }
        }else{
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  PLACING ORDER FROM CHECKOUT PAGE -------------------------------
let otp
exports.post_checkout = async (req,res)=>{
    try {
        if(req.session.user_id){
            const {paymentMethod, productArray, orderTotal}= req.body
            const deliveryAddress = req.body.delivery_Address ? JSON.parse(req.body.delivery_Address) : ''
            const currentDate = new Date()
            const deliveryDate = new Date(currentDate);
            deliveryDate.setDate(currentDate.getDate() + 5);
            const orders = {
                userId : req.session.user_id,
                totalAmount : orderTotal,
                paymentMethod,
                orderDate : currentDate,
                deliveryDate,
                deliveryAddress,
                productId : productArray
            }
            req.session.orders = orders
            otp = Math.floor(100000 + Math.random() * 900000)
            const signupData = await signupModel.findOne({_id : req.session.user_id})

            if(paymentMethod === 'cashondelivery'){
                emailCOD(signupData.email, otp)
                return res.status(200).json({success : true, COD : true})
            }
            else if(paymentMethod === 'online'){
                var instance = new Razorpay ({
                    key_id : keyId,
                    key_secret : keySecret
                });

                const totalPrice = parseInt(orderTotal) * 100
                const Order = await instance.orders.create({
                    amount : orderTotal,
                    currency : "INR",
                    receipt : "receipt",
                    payment_capture : 1
                });
                emailCOD(signupData.email, otp)
                return res.status(200).json({success : true, Order, keyId, totalPrice})
            } 
        }
    } catch (error) {
        console.log(error);
    }
}

exports.get_cod_otp = (req,res)=>{
    res.render("user/pages/CODotp")
}

//-----------------------------  VERIFYING OTP AND SAVING ORDER -------------------------------
exports.post_cod_otp = async (req,res)=>{
    try {
        const {one, two, three, four, five, six} = req.body
        const userOtp = one + two + three + four + five + six
        if(otp == userOtp){
            const prArray = req.session.orders
            prArray.productId.map(item =>{
               return item.orderStatus = "Confirmed"
            })
            const orderList = await orderModel.findOne({userId : req.session.user_id})
            if(!orderList){    // STORING ORDER DETAILS IN DATABASE
                const saved = await orderModel.create(prArray)
                if(saved){
                    const pushed = await orderModel.findOneAndUpdate(
                        {
                            userId : req.session.user_id
                        },
                        {
                            $push : {
                                orders : prArray
                            }
                        }
                    )
                    if(pushed){
                        prArray.productId.map(async (productArray) =>{
                            const productId = productArray.productId._id
                            const quantity = productArray.quantity
                            const productExist = await productModel.findOne({_id : productId})
                            const oldStock = productExist.stock
                            const currentStock = oldStock - quantity

                            // REMOVING ORDERED PRODUCT FROM CART
                            await cartModel.findOneAndUpdate(
                                {
                                    userId : req.session.user_id
                                },
                                {
                                    $pull : {
                                        products : {productId}
                                    }
                                }
                            )

                            // DECREMENTING QUANTITY OF ORDERD PRODUCT
                            await productModel.findOneAndUpdate(
                                {
                                    _id : productId
                                },
                                {
                                    $set : {
                                        stock : currentStock
                                    }
                                }
                            )
                        })
                        return res.status(200).json({success : true})
                    }else{
                        return res.status(279).json({success : false, failedCreation : true})
                    }
                }else{
                    return res.status(279).json({success : false, failedCreation : true})
                }
            }else{
                // STORING ORDER DETAILS IN DATABASE
                const pushed = await orderModel.findOneAndUpdate(
                    {
                        userId : req.session.user_id
                    },
                    {
                        $push : {
                            orders : prArray
                        }
                    }
                )
                if(pushed){
                    prArray.productId.map(async (productArray) =>{
                            const productId = productArray.productId._id
                            const quantity = productArray.quantity
                            const productExist = await productModel.findOne({_id : productId})
                            const oldStock = productExist.stock
                            const currentStock = oldStock - quantity

                            // REMOVING ORDERED PRODUCT FROM CART
                            await cartModel.findOneAndUpdate(
                                {
                                    userId : req.session.user_id
                                },
                                {
                                    $pull : {
                                        products : {productId}
                                    }
                                }
                            )

                            // DECREMENTING QUANTITY OF ORDERD PRODUCT
                            await productModel.findOneAndUpdate(
                                {
                                    _id : productId
                                },
                                {
                                    $set : {
                                        stock : currentStock
                                    }
                                }
                            )
                    })
                    return res.status(200).json({success : true})
                }else{
                    return res.status(279).json({success : false, failedCreation : true})
                }
            }
        }else{
            return res.status(289).json({success : false, otp : true})
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  CANCELLING ORDER -------------------------------
exports.patch_cancelOrder = async (req,res)=>{
    try {
        // REMOVING ORDER DETAILS FROM DATABASE
        const {productId, orderId, quantity} = req.body
        const update = await orderModel.findOneAndUpdate(
            {
                userId : req.session.user_id,
                "orders._id" : orderId,
                "orders.productId.productId" : productId
            },
            {
                $set : {
                    'orders.$[order].productId.$[product].orderStatus' : 'Cancelled'
                }
            },
            {
                arrayFilters : [
                    {
                        'order._id' : orderId
                    },
                    {
                        'product.productId' : productId
                    }
                ],
                new : true
            }
        )
        if(update){
            // CHANGING QUATITY OF CANCELLED PRODUCT
            await productModel.findOneAndUpdate(
                {
                    _id : productId,
                },
                {
                    $inc : {
                        stock : Number(quantity)
                    }
                }
            )
            return res.status(200).json({success : true})
        }else{
            return res.status(289).json({success : false})
        }
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------  ABOUT US SECTION -------------------------------
exports.get_aboutUs = (req,res)=>{
    res.render("user/pages/aboutUs")
}

//-----------------------------  USER LOG-OUT SECTION -------------------------------
exports.get_logout = (req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            console.log("Could't destroy UserSession ", error.message);
        }else{
            res.redirect("/login")
        }
    })
}
