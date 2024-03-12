const mongoose = require("mongoose")

const schema = mongoose.Schema

const shortAddress = ({
    firstname : {
        type : String
    },
    lastname : {
        type : String
    },
    phone : {
        type : Number 
    },
    district : {
        type : String
    },
    state : {
        type : String 
    },
    country : {
        type : String
    },
    zip : {
        type : Number
    },
    address : {
        type : String
    }
})

const userProfileSchema = ({
    userId : {
        type : mongoose.Types.ObjectId
    },
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    DOB : {
        type : Date,
        required : true
    },
    district : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    zip : {
        type : Number,
        required : true
    },
    landmark : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    profileImage : {
        type : String
    },
    deliveryAddresses : [shortAddress]
})

module.exports = new mongoose.model("user-profile-datas", userProfileSchema)