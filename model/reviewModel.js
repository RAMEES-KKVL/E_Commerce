const mongoose = require("mongoose")


const ratingInfo = {
    rating : {
        type : Number,
        required : true
    },
    review : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    }
}

const productReview = new mongoose.Schema({
    productId : {
        type : String,
        required : true
    },
    review : [ratingInfo]
})

module.exports = new mongoose.model("product-reviews", productReview)