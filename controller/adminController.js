exports.admin_get_login = (req,res)=>{
    res.render("admin/pages/login")
}


exports.admin_get_signup = (req,res)=>{ 
    res.render("admin/pages/signup")
}

exports.admin_get_forget_Password = (req,res)=>{ 
    res.render("admin/pages/forgetPass")
}





exports.admin_get_Home = (req,res)=>{
    res.render("admin/pages/dashboard")
}




exports.admin_get_userList = (req,res)=>{
    res.render("admin/pages/users")
}



exports.admin_delete_user = (req,res)=>{}



exports.admin_get_products = (req,res)=>{
    res.render("admin/pages/products")
}



exports.admin_get_addProduct = (req,res)=>{
    res.render("admin/pages/addProduct")
}



exports.admin_post_addProduct = (req,res)=>{}




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





exports.admin_get_addCategory = (req,res)=>{
    res.render("admin/pages/addCategory")
}





exports.admin_post_addCategory = (req,res)=>{}







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



 