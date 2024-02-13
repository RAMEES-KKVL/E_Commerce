const mongoose = require("mongoose")

const schema = {
    category : {
        type : String,
        required : true
    },
    subCategory : {
        type : Array
    },
    categoryImage : {
        type : String,
        default : false
    }
}

const categorySchema = new mongoose.Schema(schema)

const categoryModel = new mongoose.model("category-list", categorySchema)

module.exports = categoryModel