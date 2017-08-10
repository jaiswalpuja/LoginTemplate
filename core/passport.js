
const LocalStrategy = require('passport-local').Strategy;
const ppcCont       = require("../controllers/controller");

module.exports = function(passport) {

    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        ppcCont.GetUserById (id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('AuthByDB-Login', new LocalStrategy({
            // by default, local strategy uses username and password, can be override with email
            // usernameField : 'email',
            // passwordField : 'password'
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            var input = JSON.parse(JSON.stringify(req.body));
            process.nextTick(function() {
                ppcCont.AuthenticateUser(username, password, function(err, user) {
                    if (err) {
                        return done(null, false, req.flash('LoginMsg', 'Error in Authenication System, unable to log you in.'))
                    }
                    if ( user.id == 0 ) {
                        return done(null, false, req.flash('LoginMsg', 'Invalid email or password'), req.flash('username', input.username))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                    }
                    return done(null, user)
                });
            });
        }
    ));


    passport.use('AuthByDB-Register', new LocalStrategy({
            // by default, local strategy uses username and password, can be override with email
            // usernameField : 'email',
            // passwordField : 'password'
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            var input = JSON.parse(JSON.stringify(req.body));
            req.assert('username', 'required').notEmpty();           //Validate name
            req.assert('username', 'A valid email is required').isEmail();  //Validate email
            req.assert('password', 'required').notEmpty();
            req.assert('password', '8 to 20 characters required').len(8, 20);

            req.getValidationResult()
                .then(function(result){
                    console.log(result.array());
                    // console.log(result.useFirstErrorOnly());
                });

            var errors =req.validationErrors(true);

            //var errors = req.validationErrors();
            if( !errors){   //No errors were found.  Passed Validation!
                process.nextTick(function () {
                    ppcCont.RegisterUser(username, password, input.question, input.answer, function (err, user) {
                        console.log(user);
                        if (err) {
                            return done(null, false, req.flash('LoginMsg', 'Error in Authenication System, unable to log you in.'))
                        }
                        if (user.id == -1) {
                            return done(null, false, req.flash('LoginMsg', 'Email already exists!'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                        }
                        if (user.id == -2) {
                            return done(null, false, req.flash('LoginMsg', 'Unauthorized User - Please contact Admin'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                        }


                        if (input.password !== input.confirm) {
                            return done(null, false, req.flash('LoginMsg', 'Password do not match'));
                        }
                        return done(null, user)
                    });
                });
            }
            else {   //Display errors to user
                return done(null, false, req.flash('LoginMsg','Create User Failed due to invalid email or password'));
            }

        }
    ));

  /*  passport.use('AuthByDB-Forgot', new LocalStrategy({
            // by default, local strategy uses username and password, can be override with email
             usernameField : 'username',
             passwordField : 'username',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password,done) {
            process.nextTick(function() {
                ppcCont.ForgotPassword(username ,function(err, user) {
                    if (err) {
                        return done(null, false, req.flash('LoginMsg', 'Error in Authenication System, unable to log you in.'))
                    }
                    if ( user.id == 0 ) {
                        return done(null, false, req.flash('LoginMsg', 'User does not exist!'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                    }
                    return done(null, user, req.flash('LoginMsg', 'Password Reset Email sent!!'))

                });
            });
        }
    ));*/


    passport.use('AuthByDB-Forgot', new LocalStrategy({
            // by default, local strategy uses username and password, can be override with email
            usernameField : 'username',
            passwordField : 'username',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password,done) {
            var input = JSON.parse(JSON.stringify(req.body));
            process.nextTick(function() {
                console.log(input.answer);
                ppcCont.ForgotPassword(username ,input.answer, function(err, user) {
                    if (err) {
                        return done(null, false, req.flash('LoginMsg', 'Error in Authenication System, unable to log you in.'))
                    }
                    if ( user.id == 0 ) {
                        return done(null, false, req.flash('LoginMsg', 'Incorrect Answer. Please contact Admin!'), req.flash('username', input.username))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                    }
                    return done(null, user, req.flash('LoginMsg', 'Password Reset Email sent!!'))

                });
            });
        }
    ));

    passport.use('AuthByDB-Reset', new LocalStrategy({
            // by default, local strategy uses username and password, can be override with email
            // usernameField : 'email',
            // passwordField : 'password'
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            var input = JSON.parse(JSON.stringify(req.body));
            req.assert('username', 'required').notEmpty();           //Validate name
            req.assert('username', 'A valid email is required').isEmail();  //Validate email
            req.assert('password', 'required').notEmpty();
            req.assert('password', '8 to 20 characters required').len(8, 20);

            req.getValidationResult()
                .then(function(result){
                    console.log(result.array());
                    // console.log(result.useFirstErrorOnly());
                });

            var errors =req.validationErrors(true);

            //var errors = req.validationErrors();
            if( !errors){   //No errors were found.  Passed Validation!
                process.nextTick(function () {
                    ppcCont.PasswordReset(username, password, function (err, user) {
                        console.log(user);
                        if (err) {
                            return done(null, false, req.flash('LoginMsg', 'Error in Authenication System, unable to log you in.'))
                        }
                        if (user.id == -1) {
                            return done(null, false, req.flash('LoginMsg', 'User does not exists!'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                        }
                        if (user.id == -2) {
                            return done(null, false, req.flash('LoginMsg', 'Unauthorized User!'))  //, false, req.flash('LoginMsg', 'Invalid user name or password')
                        }
                        if (input.password !== input.confirm) {
                            return done(null, false, req.flash('LoginMsg', 'Password do not match'));
                        }
                        return done(null, user)
                    });
                });
            }
            else {   //Display errors to user
                return done(null, false, req.flash('LoginMsg','Password Reset Failed due to invalid email or password'));
            }

        }
    ));

}