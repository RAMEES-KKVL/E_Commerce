const mongoose = require("mongoose")

const schema = mongoose.Schema

const wishElements = {
    productId : {
        type : schema.Types.ObjectId,
        required : true,
        ref : 'product-list'
    }
}

const wishSchema = new schema({ 
    userId : {
        type : schema.Types.ObjectId,
        required : true
    },
    products : [wishElements]
    
})

module.exports = new mongoose.model('wishlist', wishSchema)