let mongoose = require('mongoose');

let mongo_connect = mongoose.connect("mongodb+srv://kartikeyakaushik999:kartikkaushik9992474801@cluster0.bmbc60h.mongodb.net/BookStoreDB?retryWrites=true&w=majority",{
    useNewUrlParser: true, useUnifiedTopology: true
})

let userSchema = mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

let userModel = mongoose.model('user_login',userSchema);
module.exports = userModel;