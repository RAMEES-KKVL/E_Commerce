

exports.get_home = async (req,res)=>{
    try {
        res.render("user/pages/userHome")
    } catch (error) {
        console.log(error);
    }
}





exports.get_product = async (req,res)=>{
    try {
        res.render("user/pages/productView")
    } catch (error) {
        console.log(error);
    }
}





























exports.get_category = (req,res)=>{}





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





exports.get_logout = (req,res)=>{}




