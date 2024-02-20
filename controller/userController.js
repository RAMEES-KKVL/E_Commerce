

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





exports.get_account = (req,res)=>{}





exports.post_profile = (req,res)=>{}





exports.get_address = (req,res)=>{}





exports.post_address = (req,res)=>{}





exports.get_orders = (req,res)=>{}





exports.get_checkout = (req,res)=>{}





exports.post_checkout = (req,res)=>{}





exports.get_payment = (req,res)=>{}





exports.post_payment = (req,res)=>{}





exports.get_logout = (req,res)=>{}




