const express = require("express")
const router = express.Router()

const adminControllerInfo = require("../controller/authController")
const adminController = require("../controller/adminController")
const productController = require("../controller/productController")
const upload = require("../middlewares/multerCategory")
const productUpload = require("../middlewares/multerProduct")
const bannerUpload = require("../middlewares/multerBanner")



router.get("/login",adminControllerInfo.admin_get_login)
router.post("/login",adminControllerInfo.admin_post_login)


router.get("/signup",adminControllerInfo.admin_get_signup)
router.post("/signup",adminControllerInfo.admin_post_signup)
 
router.get("/forget_Password",adminControllerInfo.admin_get_forget_Password)
router.post("/forget_Password",adminControllerInfo.admin_post_forget_Password)

router.get("/verification",adminControllerInfo.admin_get_verification)
router.post("/verification",adminControllerInfo.admin_post_verification)

router.get("/reset_password",adminControllerInfo.admin_get_reset_pass)
router.post("/reset_password",adminControllerInfo.admin_post_reset_pass)





router.get("/home",adminController.admin_get_Home)

router.get("/user_list",adminController.admin_get_userList)
router.delete("/user_List/delete_User/:user_id",adminController.admin_delete_user)















router.get("/products",productController.admin_get_products)
router.get("/product/subcategory_find",productController.admin_get_subcategory)

router.get("/products/add_Product",productController.admin_get_addProduct)
router.post("/products/add_Product", productUpload.array("productImage",10), productController.admin_post_addProduct)

router.get("/products/edit_Product",productController.admin_get_editProduct)
router.patch("/products/edit_product",productController.admin_patch_editProduct)                      // ?  patch  or post

router.delete("/products/delete_Product",productController.admin_delete_product)
















router.get("/orders",adminController.admin_get_orders)

router.get("/coupons",adminController.admin_get_coupons)

router.get("/coupons/add_Coupon",adminController.admin_get_addCoupon)
router.post("/coupons/add_Coupon",adminController.admin_post_addCoupon)









router.delete("/coupons/delete_Coupon",adminController.admin_delete_coupon)

router.get("/category",adminController.admin_get_category)

router.get("/category/add_Category",adminController.admin_get_addCategory)
// router.post("/category/add_subcategory", adminController.admin_post_subcategory)
router.post("/category/add_Category", upload.single("categoryImage"), adminController.admin_post_addCategory)

router.get("/category/edit_Category",adminController.admin_get_editCategory)
router.patch("/category/edit_Category",adminController.admin_patch_editCategory)         // ?  patch  or post

router.delete("/category/delete_Category",adminController.admin_delete_category)











router.get("/banners",adminController.admin_get_banners)
router.get("/banners/add_banner",adminController.admin_get_addbanner)
router.post("/banners/add_banner", bannerUpload.single("bannerImage"), adminController.admin_post_addbanner)











router.get("/logout",adminController.admin_get_logout)




module.exports = router  