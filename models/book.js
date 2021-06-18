const mongoose = require("mongoose")

const BookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Category'
    },
    author:{
        type:[String],
        required:true
    }
},{timestamps:true,})

const BookModel = mongoose.model('Book',BookSchema)

module.exports = BookModel