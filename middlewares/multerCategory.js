const multer = require("multer")

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "public/uploads/category")
    },
    filename : (req, file, cb)=>{
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + " " + file.originalname)
    }
})

const upload = multer({ storage: storage })
module.exports = upload