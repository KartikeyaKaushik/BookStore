let mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kartikeyakaushik999:kartikkaushik9992474801@cluster0.bmbc60h.mongodb.net/BookStoreDB?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

let userSchema = mongoose.Schema({
    category_name:{
        type: String,
        required: true
    },
    category_img:{
        data: Buffer,
        contentType: String
    }
});

let userModel = mongoose.model('add_category', userSchema);
module.exports = userModel;