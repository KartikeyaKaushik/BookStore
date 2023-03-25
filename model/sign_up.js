let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// var mongoose1 = require('../database_connection.js');
let url = "mongodb+srv://kartikeyakaushik999:kartikkaushik9992474801@cluster0.bmbc60h.mongodb.net/BookStoreDB?retryWrites=true&w=majority"
mongoose.connect(url,{
    useNewUrlParser:true, useUnifiedTopology: true
});
 let userSchema = mongoose.Schema({
    username:{
        type:String,
        unique: true,
        required: true
    },
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirm_password:{
        type: String,
        required: true
    }
});
// ########################## reactjs method #####################################
// userSchema.pre('save',async function(next){
//     if(this.isModified('password')){
//         this.password = await bcrypt.hash(this.password, 12);
//         this.confirm_password = await bcrypt.hash(this.confirm_password,12)
//     }
//     next();
// });
// #######################################################################

userSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
}

const userModel = mongoose.model('user',userSchema);
module.exports = userModel;

