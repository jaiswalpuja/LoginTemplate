
var sqlDb    = require("mssql");
var settings = require("../settings");

/*----------------------------------------------------
 Name: runDBQuery
 Purpose: Generic call for executing a runtime query.
 ----------------------------------------------------*/
exports.executeSql = function(sql, callback){
    var conn = new sqlDb.Connection(settings.dbConfig);
    conn.connect()
        .then(function (){

            var req = new sqlDb.Request(conn);           //create DB Request obj

            req.query(sql)
                .then(function(recordset){    //Execute query
                    callback(recordset);               // query successful, return recordset
                })
                .catch(function(err){                 //query failed
                    // console.log('Query failed: ' + err);
                    callback(null,err);
                });
        })
        .catch(function (err){                //connection failed
            // console.log('Connection failed: ' + err);
            callback(null,err);
        });
};

/*----------------------------------------------------
 Name: runDBProc
 Purpose: Generic call for executing stored procedures
 ----------------------------------------------------*/
exports.runDBProc = function(procName, parmsIn, callback){

    var conn = new sqlDb.Connection(settings.dbConfig);
    conn.connect()
        .then(function (){

            var req = new sqlDb.Request(conn)                 //create DB Request obj

            if (parmsIn != undefined || parmsIn != null) {      //If no parms sent then skip over this block
                var ParmName = ''
                var ParmValue = ''

                for (i = 0; i < parmsIn.length; i++) {           // Loop through parmsIn to create the input parameters
                    ParmName = parmsIn[i].name;                  // for the procedure being called.
                    ParmValue = parmsIn[i].value;
                    req.input(ParmName, ParmValue);
                }
            }
            //req.output('ErrorMsg', null);            //<-- Working Example using output parameter
            req.execute(procName)
                .then(function(recordset) {
                    //var msg = req.parameters.ErrorMsg.value;  //<-- Working Example using output parameter )(Readiing return value)
                    //console.log(recordset);
                    callback(recordset);
                })
                .catch(function (err){                            //procedure failed
                    // console.log('proc failed: ' + err);
                    callback(null,err);
                    conn.close()
                });
        })
        .catch(function (err){                                 //connection failed
            // console.log('Conn failed: ' + err);
            callback(null,err);
        });
};





