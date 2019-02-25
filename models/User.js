const mongoose = require('mongoose')
const Schema = mongoose.Schema



const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        min:8,
        max:30,       
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
})



UserSchema.path('username').validate((username) => {
    return username && username.length >= 2 && username.length <= 80 
} , 'Username should be a minimum of 2 and maximum of 80')

module.exports = mongoose.model('User', UserSchema)




