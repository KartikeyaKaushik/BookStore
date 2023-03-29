let exp = require('express');
let path = require('path')
let server = exp();
let mongoose = require('mongoose');
let rout = exp.Router();
server.set('view engine','ejs');
server.use(exp.static('public'));
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
mongoose.set('strictQuery',false);
const multer = require('multer');
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

server.use('/',require('./routes/dashboard_routes'));
server.use('/', require('./routes/frontend_routes'));








server.use('/',sessionChecker,rout);
server.listen(9990,()=>console.log("server running at 9990"));