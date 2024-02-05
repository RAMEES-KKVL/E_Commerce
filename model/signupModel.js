const mongoose = require("mongoose")

const schema = {
    username : {
        type : String ,
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
    }
}

const signupSchema = new mongoose.Schema(schema)

const signupModel = new mongoose.model("signup-datas", signupSchema)

module.exports = signupModel