const express = require("express")
const router = express.Router()

const userRouter = require("../controller/userController")




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

router.get("/home",userRouter.get_home)

router.get("/product",userRouter.get_product)

router.get("/category",userRouter.get_category)
// router.get("/product/payment",userRouter)

router.get("/cart",userRouter.get_cart)
router.delete("/cart/delete_Item",userRouter.delete_cart_Item)

router.get("/wishlist",userRouter.get_wishlist)
router.delete("/wishlist/delete_Item",userRouter.delete_wishlist_Item)

router.get("/account",userRouter.get_account)
router.post("/account/profile",userRouter.post_profile)
router.get("/account/shipping_Address",userRouter.get_address)
router.post("/account/shipping_Address",userRouter.post_address)
router.get("/account/orders",userRouter.get_orders)

// router.get("/orders",userRouter)

router.get("/checkout",userRouter.get_checkout)
router.post("/checkout",userRouter.post_checkout)

router.get("/payment",userRouter.get_payment)
router.post("/payment",userRouter.post_payment)

router.get("/logout",userRouter.get_logout)













module.exports = router
