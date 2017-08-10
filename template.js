 //Import the necessary libraries/declare the necessary objects
const express =      require("express");
const bodyParser =   require("body-parser");
const session =      require('express-session');
const flash =        require('connect-flash');
const settings =     require("./settings");
 const path =         require('path');
 var nodemailer = require('nodemailer');
 var methodOverride = require('method-override');
const passport =     require('passport');
                     require('./core/passport')(passport);
 const bcrypt = require('bcrypt-nodejs');

 const expressValidator = require('express-validator');



const app = express();
     app.use(bodyParser.json());
     app.use(bodyParser.urlencoded({extended: true}));
     app.use(session({
                      secret: '{z)2+.9v;343y&e884@#24##V'
                     ,resave: true
                     ,saveUninitialized: false
                     //,cookie: { secure: true }
                     }
     ));
     app.use(express.static(path.join(__dirname, 'public')));

     /* Initialize Passport and restore authentication state, if any, from the session. */
     app.use(passport.initialize());
     app.use(passport.session());
     app.use(flash());
     app.use(expressValidator());
 /* Configure view engine to render EJS templates. */
 app.set('views', __dirname + '/views');
 app.set('view engine', 'ejs');

 require('./core/routes')(app, passport); // load our routes and pass in the app and passport objects



 app.listen(settings.webPort, function (){
         console.log("Server is up on " + settings.webPort);
     });
