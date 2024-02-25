const { default: mongoose } = require("mongoose");
const wishlistModel = require("../model/wishlistModel")



exports.get_cart = async (req,res)=>{
    try {
        res.render("user/pages/cart")
    } catch (error) {
        console.log(error);
    }
}





exports.delete_cart_Item = (req,res)=>{}








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
                            products : { productId:productId1 }
                        }
                    })
                    console.log("wishPull");
                    return res.status(200).json({success: true, wishPull: true})
                }else{
                    await wishlistModel.updateOne(
                        {userId : userId1},
                        {$push : {
                            products :[{ productId:productId1 }]
                        }
                    })
                    console.log("wishPush");
                    return res.status(200).json({success: true, wishPush: true})
                }
            }else{
                const newSchema = new wishlistModel({
                    userId:userId1,
                    products : [{productId:productId1}]
                })
                newSchema.save()
                console.log("wishAdded");
                return res.status(200).json({success: true, wishAdded: true})
            }
        }else{
            return res.status(299).json({success: false})
        }

    } catch (error) {
        console.log(error);
    }
}




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
        console.log("wishPull");
        if(deleted){
            res.status(200).json({success : true})
        }else{
            res.status(290).json({success : false})
        }
    } catch (error) {
        console.log(error);
    }
}