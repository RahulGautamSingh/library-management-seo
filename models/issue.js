const mongoose = require("mongoose")

const IssueSchema = new mongoose.Schema({
    book:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Book'
    },
    member:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Member'
    },
    issueDate:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:true
    }
   
})

const IssueModel = mongoose.model('Issue',IssueSchema)

module.exports = IssueModel