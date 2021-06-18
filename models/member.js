const mongoose = require("mongoose")

function generateId()
{
    return Date.now().toString()
}
const MemberSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:false
    },
    memberId:{
        type:String,
        default:generateId,
        unique:true
    }
    
})

const MemberModel = mongoose.model('Member',MemberSchema)

module.exports = MemberModel