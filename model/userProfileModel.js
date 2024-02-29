const mongoose = require("mongoose")

const schema = mongoose.Schema

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
        type : String,
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
    }
})

module.exports = new mongoose.model("user-profile-datas", userProfileSchema)