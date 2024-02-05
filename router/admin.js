const express = require("express")
const router = express.Router()

const adminController = require("../controller/adminController")



router.get("/login",adminController.admin_get_login)
// router.post("/login",adminController.admin)


router.get("/signup",adminController.admin_get_signup)
// router.post("/signup",adminController)
 
router.get("/forget_Password",adminController.admin_get_forget_Password)
// router.post("/forget_Password",userRouter.post_forget_Password)



router.get("/home",adminController.admin_get_Home)

router.get("/user_List",adminController.admin_get_userList)
router.delete("/user_List/delete_User",adminController.admin_delete_user)

router.get("/products",adminController.admin_get_products)

router.get("/products/add_Product",adminController.admin_get_addProduct)
router.post("/products/add_Product",adminController.admin_post_addProduct)

router.get("/products/edit_Product",adminController.admin_get_editProduct)
router.patch("/products/edit_product",adminController.admin_patch_editProduct)                      // ?  patch  or post

router.delete("/products/delete_Product",adminController.admin_delete_product)

router.get("/orders",adminController.admin_get_orders)

router.get("/coupons",adminController.admin_get_coupons)

router.get("/coupons/add_Coupon",adminController.admin_get_addCoupon)
router.post("/coupons/add_Coupon",adminController.admin_post_addCoupon)

router.delete("/coupons/delete_Coupon",adminController.admin_delete_coupon)

router.get("/category",adminController.admin_get_category)

router.get("/category/add_Category",adminController.admin_get_addCategory)
router.post("/category/add_Category",adminController.admin_post_addCategory)

router.get("/category/edit_Category",adminController.admin_get_editCategory)
router.patch("/category/edit_Category",adminController.admin_patch_editCategory)         // ?  patch  or post

router.delete("/category/delete_Category",adminController.admin_delete_category)

router.get("/banners",adminController.admin_get_banners)
router.get("/banners/add_banner",adminController.admin_get_addbanner)
// router.post()

router.get("/logout",adminController.admin_get_logout)




module.exports = router  