const mongoose = require('mongoose')
const Schema = mongoose.Schema


const FarmerSchema = new Schema({
    user: {type:schema.ObjectId, ref:'User'},
    description:String,
    location:String
})



module.exports = mongoose.model("Farmer", FarmerSchema)
