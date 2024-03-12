const mongoose = require("mongoose")

const schema = mongoose.Schema

const products = {
    productId : {
        type : schema.Types.ObjectId,
        required : true,
        ref : 'product-list'
    },
    quantity : {
        type : Number,
        _id : false
    },
    size : {
        type : String,
        _id : false
    }
}

const orderDetails = {
    totalAmount : {
        type : Number,
        required : true
    },
    paymentMethod : {
        type : String,
        required : true
    },
    orderDate : {
        type : Date,
        required : true
    },
    deliveryDate : {
        type : Date,
        required : true
    },
    deliveryAddress : {
        type : String,
        required : true
    },
    orderStatus : {
        type : String,
        required : true
    },
    productId : [products]
}

const orderSchema = new schema({
    userId : {
        type : schema.Types.ObjectId,
        required : true
    },
    orders : [orderDetails]
    
})

module.exports = new mongoose.model("order-list", orderSchema)