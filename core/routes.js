/* Import required libs. */
//const path =         require('path');
//const util =         require('util');
const Cont  =  require("../controllers/controller");
const httpMsgs =  require('./httpMsgs');
var settings = require("../settings");

module.exports = function(app, passport ) {


// route middleware to make sure
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }

    var isAuthenticated = function (req, res, next) {
            if (req.isAuthenticated())
                return next();
            res.redirect('/');
        }
        ;
    app.get('/', function (req, res) {
        //util.log('Request settings. .recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
        res.render('login', {  title : settings.page_title, message: req.flash('LoginMsg'), username: req.flash('username')} );
        //res.sendFile(path.join(__dirname, './public', 'preprint.html'));
    });


   app.get('/forgot', function (req, res) {
        //util.log('Request settings. .recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
        res.render('login', {  title : settings.page_title, message: "Please enter a valid email and then click forgot" ,username: req.flash('username') } );
        //res.sendFile(path.join(__dirname, './public', 'preprint.html'));
    });
    app.get('/forgot/:username',         function(req, res) {
        Cont.GetUserInfo(req.params.username,function(err, user) {
            if (err) {
                //return done(null, false, req.flash('LoginMsg', 'Error in Authenication System, unable to log you in.'))
                res.redirect('/');
            }
            if ( !user ) {
                //res.redirect('/');
                //res.render('forgot', {  title : settings.page_title, message: "Invalid Username"} );
                //return done(null, false, req.flash('LoginMsg', 'User does not exist!'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                res.render('login', {  title : settings.page_title, message: "Inavlid User" ,username: req.flash('username') } );

            }
            if ( user.id == 0 ) {
                //res.redirect('/');
                //res.render('forgot', {  title : settings.page_title, message: "Invalid Username"} );
                //return done(null, false, req.flash('LoginMsg', 'User does not exist!'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                res.render('login', {  title : settings.page_title, message: "Incorrect Answer" ,username: req.flash('username') } );

            }

            console.log(user.username);
            console.log(user.secretQuestion);
            res.render('forgot', {  title : settings.page_title, message: req.flash('LoginMsg'),username: user.username, secretQuestion : user.secretQuestion } );

        });
    });
    app.post('/forgot',         function(req, res) {
        var input = JSON.parse(JSON.stringify(req.body));
        console.log ( input.username);
        console.log ( input.answer);
        Cont.ForgotPassword(input.username, input.answer ,function(err, user) {
            if (err) {
                //return done(null, false, req.flash('LoginMsg', 'Error in Authenication System, unable to log you in.'))
                res.redirect('/');
            }
            if ( !user ) {
                //res.redirect('/');
                //res.render('forgot', {  title : settings.page_title, message: "Invalid Username"} );
                //return done(null, false, req.flash('LoginMsg', 'User does not exist!'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                res.render('login', {  title : settings.page_title, message: "Inavlid User" ,username: req.flash('username') } );

            }
            if ( user.id == 0 ) {
                //res.redirect('/');
                //res.render('forgot', {  title : settings.page_title, message: "Invalid Username"} );
                //return done(null, false, req.flash('LoginMsg', 'User does not exist!'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                res.render('login', {  title : settings.page_title, message: "Incorrect Answer" ,username: req.flash('username') } );

            }

            console.log(user.username);
            console.log(user.secretQuestion);
            res.render('login', {  title : settings.page_title, message: 'Password Reset Email sent!!',username: user.username } );

        });
    });

    app.get('/register', function (req, res) {
        //console.log(req.flash('RegisterMsg'));
        //util.log('Request settings. .recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
        res.render('register', {  title : settings.page_title, message: req.flash('LoginMsg')} );
        //res.sendFile(path.join(__dirname, './public', 'preprint.html'));
    });
    app.get('/passreset', function (req, res) {
        //console.log(req.flash('RegisterMsg'));
        //util.log('Request settings. .recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
        res.render('passreset', {  title : settings.page_title, message: req.flash('LoginMsg')} );
        //res.sendFile(path.join(__dirname, './public', 'preprint.html'));
    });
    app.get('/Main',isAuthenticated, function (req, res) {
        //util.log('Request settings. .recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
        res.render('Main',{title : settings.page_title,  user : req.user });
    });
    app.get('/Submit',isAuthenticated, function (req, res) {
        //util.log('Request settings. .recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
        res.render('Submit',{title : settings.page_title,  user : req.user });
    });

    app.post('/login', passport.authenticate('AuthByDB-Login', {successRedirect: '/Main', failureRedirect: '/', failureFlash : true  }),
        function(req, res) {
            res.header('Access-Control-Allow-Credentials', 'true');
            res.render('Main' ,{ title : settings.page_title, message: req.flash('LoginMsg'), user : req.user });
        });

    /*app.post('/forgot', passport.authenticate('AuthByDB-Forgot', {successRedirect: '/', failureRedirect: '/', failureFlash : true  }),
        function(req, res) {
            res.header('Access-Control-Allow-Credentials', 'true');
            res.render('login' ,{ title : settings.page_title, message: req.flash('LoginMsg'), user : req.user });
        });*/

    /*app.post('/forgot', function(req, res) {
        Cont.ForgotPassword(req.body.username, function(err, user) {
            if (!err) {
                //req.flash('error', 'Password reset token is invalid or has expired.');
                //return res.redirect('/forgot');
                res.render('forgot' ,{ title : settings.page_title, message: req.flash('LoginMsg'), user : req.user });
            }
            res.render('forgot',{ title : settings.page_title, message: req.flash('LoginMsg'), user : req.user });
        });
    });*/

   /* app.post("/forgot",  function(req, res) {
        //util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
        Cont.ForgotPassword(req.body.username, res);
    });

*/

    app.get('/passreset/:token', function(req, res) {
        Cont.tokenValidation(req.params.token, function (err, user) {
            if (err) {
                //return done(null, false, req.flash('LoginMsg', 'Error in Authenication System, unable to log you in.'))
                res.redirect('/');
            }
            if (user.id == 0) {
                //req.flash('error', 'Password reset token is invalid or has expired.');
                // return res.redirect('/forgot');
                res.render('login', {
                    title: 'webTemplate',
                    message: "Invalid Token or Password Expired!!",
                    username: ''
                });
            }

            res.render('passreset', {
                title: 'webTemplate',
                message: "Please reset you password",
                username: user.username
            });
        });
    });


    app.post('/register', passport.authenticate('AuthByDB-Register', {successRedirect: '/Main', failureRedirect: '/', failureFlash : true  }),
        function(req, res) {
            res.header('Access-Control-Allow-Credentials', 'true');
            res.render('Main' ,{ title : settings.page_title, user : req.user });
        });
    app.post('/passreset', passport.authenticate('AuthByDB-Reset', {successRedirect: '/Main', failureRedirect: '/', failureFlash : true  }),
        function(req, res) {
            res.header('Access-Control-Allow-Credentials', 'true');
            res.render('Main' ,{ title : settings.page_title, user : req.user });
        });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    /*  app.post("/InitLoad", isAuthenticated, function(req, res) {
     console.log('Inside route: Call InitLoad');
     //util.log('Request settings. .recieved: \nmethod: ' + req.method + '\nurl: ' + req.url);
     //console.log('Cookies: ', req.user);
     Cont.InitLoad(req, res);
     });

     app.post('/sendEmailConfirmation',isAuthenticated, function(req, res) {
     ppcCont.sendEmailConfirmation(req, res);
     //console.log(res.body.InsertID); //Output=> like { searchid: 'Array of checked checkbox' }
     //console.log(req.body.searchid); // to get array of checked checkbox
     //return res.redirect('/Submit');
     });*/

    app.post('/resetpassword', function(req, res, next) {
        /*
         code to reset the password
         */

        // append username and new password to req.body
        // assuming passport still uses username and password as field indicator

        req.body.username= "user_name";
        req.body.password= "user_new_password";
        req.body.confirm_password= "confirm_password";
        var username = req.body.username;
        var password = req.body.password;
        var confirm = req.body.confirm;

        if (password !== confirm) return res.end('passwords do not match');


        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.sendStatus(401); }

            // it is your responsibility to establish the session
            req.logIn(user, function(err) {
                if (err) { return next(err); }

                return res.rediect("to_users_dashboard_path");
            });
        })(req, res, next);
    });


}