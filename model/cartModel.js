const mongoose = require("mongoose")

const schema = mongoose.Schema

const cartElements = {
    productId : {
        type : schema.Types.ObjectId,
        required : true,
        ref : 'product-list'
    },
    quantity : {
        type : Number,
        _id : false
    }
}

const cartSchema = ({
    userId : {
        type : schema.Types.ObjectId,
        required : true
    },
    products : [cartElements]
})

module.exports = new mongoose.model('cart-list', cartSchema)