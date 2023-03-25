let mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kartikeyakaushik999:kartikkaushik9992474801@cluster0.bmbc60h.mongodb.net/BookStoreDB?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

userSchema = mongoose.Schema({
    book_name:{
        type: String,
        required: true
    },
    book_img:{
        data: Buffer,
        contentType: String,
        
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    author_name:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    discount:{
        type: String,
        required: true
    }
})

const userModel = mongoose.model('add_product',userSchema);
module.exports = userModel;