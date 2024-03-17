const { default: mongoose } = require("mongoose");
const wishlistModel = require("../model/wishlistModel")
const cartModel = require("../model/cartModel")

//----------------------------- CART SECTION -------------------------------
exports.get_cart = async (req,res)=>{
    try {
        if(req.session){
            const userId = req.session.user_id 
            const cart = await cartModel.findOne({userId})
            const cartProductList = await cartModel.findOne({userId}).populate('products.productId')
            const cartProducts = cartProductList ? cartProductList : {products:[]}
            res.render("user/pages/cart", {userId, cart, cartProducts})
        }
    } catch (error) {
        console.log(error);
    }
}

//----------------------------- UPDATING PRODUCT QUANTITY FROM CART -------------------------------
exports.patch_cart_quantity = async (req,res)=>{
    try {
        const productId = req.query.product_id
        const {value} = req.body
        const updated = await cartModel.findOneAndUpdate(
            {userId:req.session.user_id, "products.productId" : productId},
            {$set : 
                {"products.$.quantity" : value}
            },
            {new : true}
        )
        if(updated){
            return res.status(200).json({success : true})
        }else{
            return res.status(200).json({success : true})
        }
    } catch (error) {
        console.log(error);
    }
}

//----------------------------- ADDING PRODUCT TO CART -------------------------------
exports.patch_cart_Item = async (req,res)=>{
    try {
        const user = req.session.user_id
        const product =  req.query.product_id
        const size = req.query.size
        const userId = new mongoose.Types.ObjectId(user)
        const productId = new mongoose.Types.ObjectId(product)
        
        if(user){
            const cartExist = await cartModel.findOne({userId})
            if(cartExist){
                const productExist = cartExist.products.some(product => product.productId.equals(productId))
                if(productExist){
                    return res.status(270).json({success: false, gotoCart: true})
                }else{
                    await cartModel.updateOne(
                        {userId},
                        {$push : {
                            products : [
                                {productId, quantity : 1, size}
                            ]
                        }}
                    )
                    return res.status(200).json({success: true})
                }
            }else{
                const newSchema = new cartModel({
                    userId,
                    products : [
                        {productId, quantity: 1, size}
                    ]
                })
                await newSchema.save()
                return res.status(200).json({success: true})
            }
        }else{
            return res.status(299).json({success: false, noUser: true})
        }
    } catch (error) {
        console.log(error);
    }
}

//----------------------------- REMOVING PRODUCT FROM CART -------------------------------
exports.delete_cart_Item = async (req,res)=>{
    try {
        const productId = req.query.product_id
        const  userId = req.session.user_id

        const deleted = await cartModel.updateOne(
            {userId},
            {$pull : {
                    products : {productId}
                }
            }
        )
        if(deleted){
            return res.status(200).json({success : true})
        }else{
            return res.status(290).json({success : false})
        }
    } catch (error) {
        console.log(error);
    }
}

//----------------------------- WISHLIST SECTION -------------------------------
exports.get_wishlist = async (req,res)=>{
    try {
        if(req.session){
            const userExist = req.session.user_id
            const wishlist = await wishlistModel.findOne({userId: userExist})
            const wishlistProductlist = await wishlistModel.findOne({userId: userExist}).populate('products.productId')
            const wishlistProducts = wishlistProductlist ? wishlistProductlist.products : []
            res.render("user/pages/wishlist", {userExist, wishlist, wishlistProducts})
        }
    } catch (error) {
        console.log(error);
    } 
}

//----------------------------- ADDING PRODUCT TO WISHLIST -------------------------------
exports.patch_wishlist_Item = async (req,res)=>{
    try {
        const productId = req.query.productId
        const userId = req.session.user_id
        const userId1 =  new mongoose.Types.ObjectId(userId)
        const productId1 =  new mongoose.Types.ObjectId(productId)

        if(userId){
            const wishlistExist = await wishlistModel.findOne({userId})
            if(wishlistExist){
                const productExist = wishlistExist.products.find(product => product.productId == productId)
                if(productExist){ 
                    await wishlistModel.updateOne(
                        {userId : userId1},
                        {$pull : {
                            products : 
                                { productId:productId1 }
                        }
                    })
                    return res.status(200).json({success: true, wishPull: true})
                }else{
                    await wishlistModel.updateOne(
                        {userId : userId1},
                        {$push : {
                            products :
                                { productId:productId1 }
                        }
                    })
                    return res.status(200).json({success: true, wishPush: true})
                }
            }else{
                const newSchema = new wishlistModel({
                    userId:userId1,
                    products : [
                        {productId : productId1}
                    ]
                })
                await newSchema.save()
                return res.status(200).json({success: true, wishAdded: true})
            }
        }else{
            return res.status(299).json({success: false})
        }
    } catch (error) {
        console.log(error);
    }
}

//----------------------------- REMOVING PRODUCT FROM WISHLIST -------------------------------
exports.delete_wishlist_Item = async (req,res)=>{
    try {
        const product_id = req.query.productId
        const productId = new mongoose.Types.ObjectId(product_id)
        const user_Id = req.session.user_id
        const userId = new mongoose.Types.ObjectId(user_Id)

        const deleted = await wishlistModel.updateOne(
            {userId},
            {$pull : {
                products : {productId}
            }
        })
        if(deleted){
            return res.status(200).json({success : true})
        }else{
            return res.status(290).json({success : false})
        }
    } catch (error) {
        console.log(error);
    }
}