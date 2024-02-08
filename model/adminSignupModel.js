const mongoose = require("mongoose")

const schema = {
    name : {
        type :String,
        required : true
    },
    email : {
        type : String , 
        required : true
    },
    phone : {
        type : Number ,
        required : true
    },
    password:{
        type:String,
        required:true
    },
    verified : {
        type : Boolean
    },
    createdat : {
        type : Date ,
        default : Date.now
    }
}

const adminSignupSchema = new mongoose.Schema(schema)

const adminSignupModel = new mongoose.model("admin-signup-datas", adminSignupSchema)

module.exports = adminSignupModel