const { default: mongoose } = require("mongoose");

const adminSchema = new mongoose.Schema({
    email:{type:String , required:true,unique:true},
    password:{type:String,required:true}
})


const adminModel = mongoose.model('admin',adminSchema);

module.exports = adminModel