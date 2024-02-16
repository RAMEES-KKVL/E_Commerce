const mongoose = require("mongoose")

const schema = {
    couponName : {
        type : String,
        required : true
    },
    couponDiscount : {
        type : String,
        required : true
    },
    minOrderAmount : {
        type : Number,
        required : true
    },
    maxOrderAmount : {
        type : Number,
        required : true
    },
    startingDate : {
        type : String,
        required : true
    },
    endingDate : {
        type : String,
        required : true
    }
}

const couponSchema = new mongoose.Schema(schema)

const couponModel = new mongoose.model("coupon-list", couponSchema)

module.exports = couponModel