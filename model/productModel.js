const mongoose = require("mongoose")

const schema = {
    productName : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    discount : {
        type : Number,
        required : true
    },
    stock : {
        type : Number,
        required : true 
    },
    category : {
        type : String,
        required : true
    },
    subCategory : {
        type : String
    },
    deliveryDate : {
        type : Number,
        required : true
    },
    colour : {
        type : Array
    },
    size : {
        type : Array
    },
    descriptions : {
        type : String,
        required : true
    },
    productImage : {
        type : Array,
        required : true
    }
}

const productSchema = new mongoose.Schema(schema)

const productModel = new mongoose.model("product-list", productSchema)

module.exports = productModel