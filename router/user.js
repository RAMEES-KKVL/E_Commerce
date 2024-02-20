const express = require("express")
const router = express.Router()

const userRouter = require("../controller/authController")
const userRouterWeb = require("../controller/userController")
const cartController = require("../controller/cartController")



router.get("/signup",userRouter.get_signup)
router.post("/signup",userRouter.post_signup)

router.get("/login",userRouter.get_login)
router.post("/login",userRouter.post_login)
 
router.get("/otp",userRouter.get_otp)
router.post("/otp",userRouter.post_otp)

router.get("/otp/resend_otp",userRouter.get_resend_otp)
 
router.get("/forget_Password",userRouter.get_forget_Password)
router.post("/forget_Password",userRouter.post_forget_Password)

router.get("/forget_Password/otp",userRouter.get_forget_Password_otp)
router.post("/forget_Password/otp",userRouter.post_forget_Password_otp)

router.get("/reset_Password",userRouter.get_reset_Password)
router.post("/reset_Password",userRouter.post_reset_Password)







router.get("/home",userRouterWeb.get_home)

router.get("/product",userRouterWeb.get_product)

router.get("/category",userRouterWeb.get_category)
// router.get("/product/payment",userRouter)





router.get("/cart",cartController.get_cart)
router.delete("/cart/delete_Item",cartController.delete_cart_Item)





router.get("/wishlist",cartController.get_wishlist)
router.delete("/wishlist/delete_Item",cartController.delete_wishlist_Item)





router.get("/account",userRouterWeb.get_profile)
router.post("/account/profile",userRouterWeb.post_profile)





router.get("/account/profile_Edit",userRouterWeb.get_edit_address)
router.post("/account/profile_Edit",userRouterWeb.post_edit_address)

router.get("/account/orders",userRouterWeb.get_orders)

// router.get("/orders",userRouter)

router.get("/checkout",userRouterWeb.get_checkout)
router.post("/checkout",userRouterWeb.post_checkout)

router.get("/payment",userRouterWeb.get_payment)
router.post("/payment",userRouterWeb.post_payment)

router.get("/logout",userRouterWeb.get_logout)













module.exports = router
