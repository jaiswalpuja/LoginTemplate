
var db       = require("../core/db");
var httpMsgs = require("../core/httpMsgs");
var settings = require("../settings");

/*----------------------------------------------------
 Name: Authenticate User
 Purpose: Returns an authenticated user object from
 the DB
 ----------------------------------------------------*/

exports.AuthenticateUser = function(username, password, cb){
    var parmsIn = [];
    var parm= {};
    parm.name = 'username';
    parm.value = username
    parmsIn.push(parm);
    var parm = {};
    parm.name = 'password';
    parm.value = password
    parmsIn.push(parm);

    db.runDBProc('dbo.sp_NodeAuthenticateUser', parmsIn, function( data, err){
        if (!err && data[0][0].ErrMessage == undefined) {
            return cb(null, data[0][0]);   /*<-- Return the user object to passport  */
        } else {
            return cb(data[0][0].ErrMessage, null);  /*<-- Return the error message to passport  */
        }
    })
};

/*----------------------------------------------------
 Name: Register User
 Purpose: Create a login for Authorized user
 ----------------------------------------------------*/

exports.RegisterUser = function(username, password, question, answer , cb){

    var parmsIn = [];
    var parm= {};
    parm.name = 'username';
    parm.value = username
    parmsIn.push(parm);
    var parm = {};
    parm.name = 'password';
    parm.value = password
    parmsIn.push(parm);
    var parm = {};
    parm.name = 'secretQuestion';
    parm.value = question
    parmsIn.push(parm);
    var parm = {};
    parm.name = 'secretAnswer';
    parm.value = answer
    parmsIn.push(parm);


    db.runDBProc('dbo.sp_NodeRegisterUser', parmsIn, function( data, err){
        //console.log(data);
        if (!err && data[0][0].ErrMessage == undefined) {
            return cb(null, data[0][0]);   /*<-- Return the user object to passport  */
        } else {
            return cb(data[0][0].ErrMessage, null);  /*<-- Return the error message to passport  */
        }
    })
};


/*----------------------------------------------------
 Name:Get User Info

 ----------------------------------------------------*/
exports.GetUserInfo = function(username, cb){

    var parmsIn = [];
    var parm= {};
    parm.name = 'username';
    parm.value = username
    parmsIn.push(parm);
    console.log("Inside Get User Info");
    console.log(parmsIn);
    db.runDBProc('dbo.sp_Node_GetUserInfoByEmail', parmsIn, function( data, err){
        if (!err ) {
            console.log("success");
            console.log(data[0][0]);
            //httpMsgs.show200(username, res, data);
            return cb(null, data[0][0]);   /*<-- Return the user object to passport  */
            //res.render('/Submit' ,{ title : settings.page_title, user : username });
        } else {
            return cb(err, null);  /*<-- Return the error message to passport  */
            //httpMsgs.show500(username, res, err);
            console.log(err);
        }//res.end();
    })
};


/*----------------------------------------------------
 Name:Forgot Password -email

 ----------------------------------------------------*/
exports.ForgotPassword = function(username, secretAnswer, cb){

    var parmsIn = [];
    var parm= {};
    parm.name = 'username';
    parm.value = username
    parmsIn.push(parm);
    var parm = {};
    parm.name = 'secretAnswer';
    parm.value = secretAnswer
    parmsIn.push(parm);
    console.log("Inside forgot pswd");
    console.log(parm);
    db.runDBProc('dbo.sp_Node_ValidateUser', parmsIn, function( data, err){
        if (!err ) {
            console.log("success");
            console.log(data[0][0]);
            //httpMsgs.show200(username, res, data);
            return cb(null, data[0][0]);   /*<-- Return the user object to passport  */
            //res.render('/Submit' ,{ title : settings.page_title, user : username });
        } else {
            return cb(err, null);  /*<-- Return the error message to passport  */
            //httpMsgs.show500(username, res, err);
            console.log(err);
        }//res.end();
    })
};

/*----------------------------------------------------
 Name:validate token for passreset

 ----------------------------------------------------*/
exports.tokenValidation = function(token, cb){

    var parmsIn = [];
    var parm= {};
    parm.name = 'token';
    parm.value = token
    parmsIn.push(parm);
    console.log("Inside Token Validation ");
    console.log(parmsIn);
    db.runDBProc('dbo.sp_Node_tokenValidation', parmsIn, function( data, err){
        if (!err ) {
            console.log("success");
            console.log(data[0][0]);
            //httpMsgs.show200(username, res, data);
            return cb(null, data[0][0]);   /*<-- Return the user object to passport  */
            //res.render('/Submit' ,{ title : settings.page_title, user : username });
        } else {
            return cb(err, null);  /*<-- Return the error message to passport  */
            //httpMsgs.show500(username, res, err);
            console.log(err);
        }//res.end();
    })
};




exports.PasswordReset = function(username, password, cb){

    var parmsIn = [];
    var parm= {};
    parm.name = 'username';
    parm.value = username
    parmsIn.push(parm);
    var parm = {};
    parm.name = 'password';
    parm.value = password
    parmsIn.push(parm);


    db.runDBProc('dbo.sp_NodePasswordReset', parmsIn, function( data, err){
        //console.log(data);
        if (!err && data[0][0].ErrMessage == undefined) {
            return cb(null, data[0][0]);   /*<-- Return the user object to passport  */
        } else {
            return cb(data[0][0].ErrMessage, null);  /*<-- Return the error message to passport  */
        }
    })
};
/*----------------------------------------------------
 Name: GetUserById
 ----------------------------------------------------*/

exports.GetUserById = function(id, cb){
    var parmsIn = [];
    var parm= {};
    parm.name = 'UserId';
    parm.value = id
    parmsIn.push(parm);

    db.runDBProc('dbo.sp_NodeGetUserById', parmsIn, function( data, err){
        if (!err) {
            return cb(null, data[0][0]);
        } else {
            return cb(err, null);
        }
    })
};

/*----------------------------------------------------
 Name: InitLoad
 Purpose: Calls the approprate procedure and returns
 data or error message to the client.
 ----------------------------------------------------*/
/*
 exports.InitLoad = function(req,resp){
 var input = JSON.parse(JSON.stringify(req.body));
 var parmsIn = [];
 var parm= {};
 parm.name = 'userid';
 parm.value = input.userid
 parmsIn.push(parm);
 console.log('Inside controller: Call InitLoad');


 db.runDBProc('dbo.sp_NodeInitLoad', parmsIn, function( data,err){
 if (!err) {
 console.log(data[2]);
 httpMsgs.show200(req, resp, data);
 } else {
 httpMsgs.show500(req, resp, err);
 }
 resp.end();
 })
 };*/


/*----------------------------------------------------
 Name: Send Email Confirmation
 ----------------------------------------------------*/
/*
 exports.sendEmailConfirmation = function(req,resp){
 var input = JSON.parse(JSON.stringify(req.body));
 var parmsIn = [];
 var parm= {};
 parm.name = 'userid';
 parm.value = input.userid
 parmsIn.push(parm);
 console.log("Inside email send");
 db.runDBProc('dbo.sp_NodeEmailConfirmation', parmsIn, function( data,err){
 if (!err) {
 //Use this to convert sql returned dataset
 //var obj = JSON.parse(JSON.stringify(data[0][0]));
 //console.log (obj.insertid);
 httpMsgs.show200(req, resp, data);
 } else {
 httpMsgs.show500(req, resp, err);
 }
 resp.end();
 })
 };*/