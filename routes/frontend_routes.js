let exp = require('express');
let path = require('path')
let server = exp();
let mongoose = require('mongoose');
let rout = exp.Router();
server.set('view engine','ejs');
server.use(exp.static('public'));
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({extended:true}));
mongoose.set('strictQuery',false);
const multer = require('multer');
let userModel_sign_up = require('../model/sign_up');
let userModel_login = require('../model/login.js');
let userModel_news_letter = require('../model/news_letter.js')
let userModel_add_product = require('../model/add_product.js');
let userModel_add_category = require('../model/add_category.js');
let userModel_queries = require('../model/queries');
let userModel_cart = require('../model/cart');
const bcrypt = require('bcryptjs');
let cookieParser = require('cookie-parser');
let session = require('express-session');
server.use(cookieParser());
server.use(
    session({
        key: "user_id",
        secret: "dkfjdkjfkdj",
        resave: true,
        saveUninitialized: false,
        cookie: {
            expires: 500000
        }
    })
);
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
 
rout.get('/',async(req,res)=>{
    try{
        const dataa = await userModel_add_category.find();
        const dataa2 = await userModel_add_product.find().limit(6);
        const dataa3 = await userModel_add_product.find().skip(8).limit(6);
        // console.log(req.session.user);
        const user = await req.session.user;
        if(dataa && dataa2){
            res.render('index.ejs',{data:dataa,data2:dataa2,data3:dataa3,user});
        }
    }
    catch(error){
        console.log(error);
    }

})

// rout.get('/',function(req,res){
//     userModel_add_category.find().then((data)=>{
//         // console.log(data); 
//         res.render('index.ejs',{data:data});
//     })
    
//     userModel_add_product.find().limit(6).then((data)=>{
//         console.log(data);
//         res.render('index.ejs',{data2:data});
//     })
//     .catch((error)=>{
//         console.log(error);
//         res.redirect('/');
//     })
    
//     // res.sendFile(__dirname+"/views/index.ejs");
// })

// ################ done by mam ##########################
// rout.get('/getproduct',function(req,res){
//     userModel_add_category.find().then((data)=>{
//         // console.log(data); 
//         res.render('index.ejs',{data:data});
//     })
//     .catch((error)=>{
//         console.log(error);
//         res.redirect('/');
//     })
    
//     // res.sendFile(__dirname+"/views/index.ejs");
// })




rout.get('/about_us',function(req,res){
    let user = req.session.user;
    res.render('about_us',{user});
})

rout.get('/contact_us',function(req,res){
    let user = req.session.user;
    res.render('contact',{user});
})

rout.get('/genres',function(req,res){
    user = req.session.user;
    userModel_add_category.find().then((data)=>{
        res.render('genres.ejs',{data: data});
    })
    .catch((error)=>{
        res.redirect('/');
        console.log(error);
    })
})

rout.get('/new_arrivals',function(req,res){
    res.render('new_arrivals.ejs');
})

rout.get('/most_popular',function(req,res){
    res.render('most_popular.ejs');
})

rout.post('/news_letter',(req,res)=>{
    let news_letterr = new userModel_news_letter({
        email: req.body.email
    })
    news_letterr.save().then((result)=>{
        // console.log(result);
        res.redirect('/');
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/dashboard');
    })
})

rout.post('/login', async(req,res)=>{
    var username = req.body.username,
    password = req.body.password;

    try{
        const userr = await userModel_sign_up.findOne({username: username}).exec();
        let user = req.session.user;
        // console.log(userr);
        // console.log(req.session.user);
        if(!userr){
            res.redirect("/");
        }
        userr.comparePassword(password,(error, match) => {
            if(!match) {
              res.redirect("/");
              console.log(error);
           }
       });

       // ####################### reactjs method #############################
        // const isMatch = await bcrypt.compare(password,userr.password);
        // if(!isMatch){
        //     // res.json({error: 'invalid credentials'});
        //     console.log('invalid credentials');
        // }
        // #####################################
        req.session.user = userr;
        res.redirect("/");
        // console.log(req);
        // console.log(req.session);
        // res.status(200).json({message: 'Redirecting to dashboard page'});
    }
    catch(error){
        console.log(error);
    }
});

rout.post('/sign_up',function(req,res){
    let user = new userModel_sign_up({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    });
    // user.save(function(error,docs){
    //     if(error){
    //         res.redirect("/");
    //     }
    //     else{
    //         console.log(docs);
    //         window.alert("Signed Up. Successfully!!");
    //     }
    // });

    user.save().then((result)=>{
        console.log("saved data",result);
        res.redirect('/'); 
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('/');
    })
});

// ************************** queries api ********************************

rout.post('/queries',(req,res)=>{
    let query = new userModel_queries({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        subject: req.body.subject
    });
    query.save().then((data)=>{
        // console.log(data);
        res.redirect('/contact_us');
    })
    .catch((error)=>{
        console.log(error); 
        res.redirect('/');
    })
})

// *******************************************************************

rout.get('/genres/:id',(req,res)=>{
    let user = req.session.user;
    userModel_add_product.find({category: req.params.id}).then((data)=>{
        res.render('genres_books',{data:data,user});
        // console.log(data);
    })
    .catch((error)=>{
        console.log(error);
        res.redirect('/');
    })
})

rout.get('/view_book/:id',(req,res)=>{
    userModel_add_product.findById(req,params.id).then((data)=>{
        res.render('view_book',{data:data});
    })
})

rout.get('/logout',(req,res,next)=>{
    if(req.session){
        req.session.destroy(function(error){
            if(error){
                return next(error);
            }
            else{
                return res.redirect('/')
            }
        })
    }
})

//  or 

// rout.get('/logout',(req,res)=>{
//     if(req.sessionID.user && req.cookies.user_id){
//         res.clearCookie('user_id');
//         res.redirect('/');
//     }
//     else{
//         res.redirect('/login');
//     }
// })
rout.get('/cart',async function(req,res){
    try{
        let user = req.session.user;
        let data = await userModel_cart.find({user:user.username});
        res.render('cart.ejs',{user,data});
        // console.log(user.username);
    }
    catch(error){
        console.log(error);
    }
})

rout.get('/cart/:id', async function(req,res){
    // console.log(userr);

    try{
        let userr = req.session.user;
        let product = await userModel_add_product.findById(req.params.id);
        // console.log(product);
        if(product){
            let data = await userModel_cart.findOne({book_name: product.book_name});
            if(data){
                let data2 = await userModel_cart.updateOne({book_name:product.book_name},{$inc:{quantity:1}});
                if(data2){
                    console.log("quantity updated")
                    res.redirect('/cart')
                }
                else{
                    console.log("error occured while updating quanitty");
                    res.redirect('/')
                }
            }
            else{
                console.log(product);
                let cart = new userModel_cart({
                    book_name:product.book_name,
                    book_img:product.book_img,
                    author_name:product.author_name,
                    price:product.price,
                    user:userr.username
                });
                cart.save().then(()=>{
                    res.redirect('/cart');
                })
                .catch((error)=>{
                    res.redirect("/")
                    console.log(error);
                })
            }
            

            // let data = await cart.save();
            // if(data){
            //     console.log("added to cart");
            //     res.redirect('/dashboard');
            // }
            // res.redirect('/');


            
        }
    }
    catch(error){
        console.log(error);
    }
})

rout.get('/remove_cart_item/:id', async(req, res)=>{
    try{
        let data = await userModel_cart.findByIdAndRemove(req.params.id);
        if(!data){
            res.redirect('/');
            console.log('item not removed');
        }
        else{
            res.redirect('/cart');
            console.log('item removed from cart');
        }
    }
    catch(error){
        console.log(error);
    }
    
})

rout.get('/quantity_inc/:id', async(req, res)=>{
    // let user = req.session.user;
    // const {book_img} = req.file.filename;
    // const{book_name,author_name, price} = req.body;
    try{
        // console.log(req.params.id)
        let data = await userModel_cart.updateOne({_id:req.params.id},{$inc:{quantity:1}});
        if(data){
            res.redirect('/cart')
        }
        else{
            console.log(error);
            res.redirect('/')
        }
    }
    catch(error){
        console.log(error);
    }
    
})

rout.get('/quantity_dec/:id', async(req, res)=>{
    try{
        let data2 = await userModel_cart.findById(req.params.id);
        if(data2.quantity>1){
            let data = await userModel_cart.updateOne({_id:req.params.id},{$inc:{quantity:-1}});
            if(data){
                res.redirect('/cart')
            }
            else{
                console.log(error);
                res.redirect('/')
            }
        }
        else{
            res.redirect('/cart');
            console.log("cannot change quantity to zero you can remove it from cart if you want");
        }
        
    }
    catch(error){
        console.log(error);
    }
})


server.use('/',rout);
module.exports = rout;