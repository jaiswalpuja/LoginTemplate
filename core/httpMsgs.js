var http     = require("http");
var settings = require("../settings");


exports.show200 = function (req, resp, data ){
    if (settings.httpMsgsFormat == "HTML"){
        resp.writeHead(200, {"Content-type":"text/html"});
        resp.write("<html><body>" + JSON.stringify(data) + "</body></html>");
    }else{
        resp.writeHead(200, {"Content-type":"application/json"});
        resp.write(JSON.stringify(data));
    }
        resp.end();
};

exports.show401 = function (req, resp){
    if (settings.httpMsgsFormat == "HTML"){
        resp.writeHead(401, {"Content-type":"text/html"});
        resp.write("<html><body>Invalid or expired session, please login again.</body></html>");
    }else{
        resp.writeHead(401, {"Content-type":"application/json"});
        resp.write(JSON.stringify({ data:"Invalid or expired session: " }));
    }
        resp.end();
}

exports.show404 = function (req, resp, url){
    if (settings.httpMsgsFormat == "HTML"){
        resp.writeHead(200, {"Content-type":"text/html"});
        resp.write("<html><body>Resource not found: " + url + "</body></html>");
    }else{
        resp.writeHead(200, {"Content-type":"application/json"});
        resp.write(JSON.stringify({ data:"Requested URL not found: " + url }));
    }
    resp.end();
}

exports.show500 = function (req, resp, err ){
    if (settings.httpMsgsFormat == "HTML"){
        resp.writeHead(500,"Internal error occured", {"Content-type":"text/html"});
        resp.write("<html><body>'Error occured: '"  + err + "</body></html>");
    }else{
        resp.writeHead(500, {"Content-type":"application/json"});
        resp.write(JSON.stringify({ data:"Error occured: "  + err }));
    }
        resp.end();
};