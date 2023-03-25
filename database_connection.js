let mongo = require('mongoose');

//atlas connection
let mongo_export = mongo.connect("mongodb+srv://kartikeyakaushik999:kartikkaushik9992474801@cluster0.bmbc60h.mongodb.net/BookStoreDB?retryWrites=true&w=majority",
{
    useNewUrlParser:true,
    useUnifiedTopology:true
}
)
.then(()=>console.log("connection successfully.."))
.catch((err)=>console.log(err));

// module.exports = mongo_export;



//local host connection
// let mongo_export = mongo.connect("mongodb://127.0.0.1:27017/mydb",
// {
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }
// )
// .then(()=>console.log("connection successfully.."))
// .catch((err)=>console.log(err));