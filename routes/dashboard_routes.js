let exp = require('express');
const path = require('path');
let server = exp();
let mongoose = require('mongoose');
let rout = exp.Router();
const fs = require('fs')
server.set('view engine','ejs');
server.use(exp.static('public'));
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
mongoose.set('strictQuery',false);
const multer = require('multer');
let userModel_sign_up = require('../model/sign_up');
let userModel_login = require('../model/login.js');
let userModel_news_letter = require('../model/news_letter.js');
let userModel_add_product = require('../model/add_product.js');
let userModel_add_category = require('../model/add_category.js');
const bcrypt = require('bcryptjs');
let cookieParser = require('cookie-parser');
let session = require('express-session');
server.use(cookieParser());
  
server.use(
    session({
        key: "user_id",
        secret: "dkfjdkjfkdj",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 500000,
        }
    })
)
server.use((req,res,next)=>{
    if(req.cookies.user_id && !req.session.user){
        res.clearCookie("user_id");
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next)=>{
    if(req.session.user && req.cookies.user_id){
        res.redirect('/');
    }
    else{
        next();
    }
}

const storage = multer.diskStorage({
    destination: (req, file,cb)=>{
        cb(null,'public/uploads')
    },
    filename: (req,file,cb)=>{
        console.log(file);
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage: storage})

rout.get('/dashboard',function(req,res){
    if(req.session.user && req.cookies.user_id){
        res.render('./dashboard/dashboard.ejs');
    }
    else{
        res.redirect('/');
        // alert('please login first');
    }
})

rout.get('/add_product',function(req,res){
    userModel_add_category.find().then((data)=>{
        res.render('./dashboard/add_prod',{data:data});
        // console.log(data);
    })
    .catch((error)=>{ 
        console.log(error);
    })
    // res.render('dashboard/add_prod.ejs');
})

rout.get('/view_product',function(req,res){
    userModel_add_product.find().then((data)=>{
        res.render('./dashboard/view_prod',{data:data});
        // console.log(data);
    })
    .catch((error)=>{
        res.render('./dashboard/dashboard');
    })
    // res.render('./dashboard/view_prod.ejs');
})

rout.get('/registered_users',function(req,res){
    // userModel_sign_up.find(function(error,data){
    //     if(error){
    //         console.log(error);
    //     }
    //     else{
    //         res.render('dashboard',{data1: data});
    //         console.log(data);
    //     }
    // })
    userModel_sign_up.find().then((data)=>{
        res.render('./dashboard/registered_users',{data:data})
        //  console.log(data);
    })
    .catch((error)=>{
        console.log(error);
    })
    // res.render('./dashboard/registered_users.ejs');
})

rout.get('/add_category',function(req,res){
    res.render('./dashboard/add_category.ejs');
})

rout.post('/add_product', upload.single('book_img'),(req,res)=>{
    let product = new userModel_add_product({
        book_name: req.body.book_name,
        book_img: {
            data: req.file.filename,
            contentType: 'image/jpg'
        },
        category: req.body.category,
        description: req.body.description,
        author_name: req.body.author_name,
        price: req.body.price,
        discount: req.body.discount
    });
    product.save().then(()=>{
        console.log("data saved");
        res.redirect('/add_product');
    })
    .catch((error)=>{
        console.log(error);
        console.log(req.body);
        res.redirect('/')
    })
})
// ############################# add/edit category #####################

rout.post('/add_category',upload.single('category_img'),(req,res)=>{
    let cat = new userModel_add_category({
        category_name: req.body.category_name,
        category_img: {
            data: req.file.filename,
            contentType: 'image/jpg'
        }
    }) 
    cat.save().then((result)=>{
        console.log("cat added successfully",result);
        // window.alert("success");
        res.redirect('/add_category');
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/add_category');
    })
})

rout.get('/view_cat',(req,res)=>{
    userModel_add_category.find().then((data)=>{
        res.render('dashboard/view_cat',{data:data});
    })
    .catch((error)=>{
        res.redirect('/dashboard');
        console.log(error);
    })
})

rout.get('/edit_cat/:id',(req,res)=>{
    userModel_add_category.findById(req.params.id).then((data)=>{
        res.render('dashboard/edit_category',{data:data});
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/view_cat');
    })
})


rout.post('/update_cat/:id',upload.single('category_img'),(req,res)=>{
    userModel_add_category.findByIdAndUpdate(req.params.id,{
        category_name: req.body.category_name,
        category_img: {
            data: req.file.filename,
            contentType: 'image/jpg'
        }
    }).then(()=>{
        res.redirect('/view_cat');
    })
    .catch((error)=>{
        res.redirect('/dashboard');
        console.log(error);
    })
})

rout.get('/remove_cat/:id',(req,res)=>{
    userModel_add_category.findByIdAndRemove(req.params.id).then(()=>{
        res.redirect('/view_cat');
    })
    .catch((error)=>{
        res.redirect('/view_cat');
        console.log(error);
    })
})

// ##############################################################

// ############################### reg_users buttons functionality ###################
rout.get('/remove/:id',(req,res)=>{
    userModel_sign_up.findByIdAndRemove(req.params.id).then(()=>{
        res.redirect('../registered_users');
    })
    .catch((error)=>{
        res.redirect('../registered_users');
    })
    // userModel_sign_up.findByIdAndRemove(req.params.id, (error)=>{
    //     if(error){
    //         res.redirect('./dashboard/registered_users')
    //     }
    //     else{
    //         res.redirect('./dashboard/registered_users')
    //     }
    // })
})

rout.get('/edit/:id',(req,res)=>{
    userModel_sign_up.findById(req.params.id).then((data)=>{

        // console.log(data);
        res.render('./dashboard/edit_sign_up',{data:data});
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/dashboard');
    })
})

rout.post('/edit_sign_up/:id',(req,res)=>{
    let user2 = userModel_sign_up.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password,
        confirm_password: req.body.confirm_password
    }).then(()=>{
        res.redirect('/registered_users');
        // console.log(result); 
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/edit/'+req.params.id);
    })
})

rout.get('/view/:id',(req,res)=>{
    userModel_sign_up.findById(req.params.id).then((data)=>{
        res.render('./dashboard/user_details',{data:data});
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/dashboard');
    })
})
// ############################### product buttons functionality ###################
rout.get('/delete/:id',(req,res)=>{
    userModel_add_product.findByIdAndRemove(req.params.id).then(()=>{
        res.redirect('/view_product');
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/view_product')
    })
})

rout.get('/edit_product/:id', async(req,res)=>{
    try{
        let dataa = await userModel_add_product.findById(req.params.id);
        let dataa2 = await userModel_add_category.find();
        if(dataa && dataa2){
            res.render('dashboard/edit_product',{data:dataa, data2: dataa2});
        }
    }
    catch(error){
        console.log(error);
        res.redirect('/dashboard');
    }
})


// rout.get('/edit_product/:id',(req,res)=>{
//     // userModel_add_category.find().then((data)=>)
//     userModel_add_product.findById(req.params.id).then((data)=>{
//         console.log(data);
//         res.render('dashboard/edit_product',{data:data});
//     })
//     .catch((error)=>{
//         console.log(error);
//         res.redirect('/dashboard')
//     })
// })

rout.post('/update_product/:id',upload.single('book_img'),(req,res)=>{
    // let products = ;
    userModel_add_product.findByIdAndUpdate(req.params.id,{
        book_name: req.body.book_name,
        book_img: {
            data: req.file.filename,
            contentType: 'image/jpg'
        },
        // category: req.body.category,
        description: req.body.description,
        author_name: req.body.author_name,
        price: req.body.price,
        discount: req.body.discount
    }).then(()=>{
        res.redirect('/view_product');
        // window.alert('success');
        // console.log(data);
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/edit_product/'+req.params.id);
    })
})

rout.get('/view_product/:id',function(req,res){
    userModel_add_product.findById(req.params.id).then((data)=>{
        res.render('dashboard/product_details',{data:data});
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/view_product');
    })
})

// rout.get('view_product/:id',function(req,res){
//     userModel_add_product.findById(req.params.id).then(function(data){
//         res.render('dashboard/product_details',{data:data});
//     })
//     .catch(function(error){
//         console.log(error);
//         res.redirect('/view_product');
//     })
// })
//##########################################################################






server.use('/',rout);
module.exports = rout;