



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
        res.render("user/pages/wishlist")
    } catch (error) {
        console.log(error);
    }
}





exports.delete_wishlist_Item = (req,res)=>{}

