const multer = require("multer")

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "public/uploads/banner")
    },
    filename : (req, file, cb)=>{
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + "-" + file.originalname)
    }
})

const bannerUpload = multer({ storage: storage }) 
module.exports = bannerUpload