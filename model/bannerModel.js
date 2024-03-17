const mongoose = require("mongoose")

const schema = {
    bannerName : {
        type : String,
        required : true
    },
    offerPrice : {
        type : Number,
        required : true
    },
    bannerHeading : {
        type : String,
        required : true
    },
    startingDate : {
        type : Date,
        required : true
    },
    endingDate : {
        type : Date,
        required : true
    },
    bannerImage : {
        type : String,
        required : true
    }
}

const bannerSchema = new mongoose.Schema(schema)

const bannerModel = new mongoose.model("banner-lists", bannerSchema)

module.exports = bannerModel