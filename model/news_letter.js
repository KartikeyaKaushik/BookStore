let mongoose = require('mongoose');

mongoose.connect("mongodb+srv://kartikeyakaushik999:kartikkaushik9992474801@cluster0.bmbc60h.mongodb.net/BookStoreDB?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

let userSchema = mongoose.Schema({
    email:{
        type: String
    }
})

let userModel = mongoose.model('news_letter',userSchema);
module.exports = userModel;