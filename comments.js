// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var ROOT_DIR = "html/";
var comments = require('./comments');

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    console.log("URL path: " + urlObj.pathname);
    console.log("URL search: " + urlObj.search);
    console.log("URL query: " + urlObj.query["q"]);

    if (urlObj.pathname.indexOf("comment") != -1) {
        console.log("comment route");
        if (req.method === "POST") {
            console.log("POST comment route");
            // Read the user data
            var jsonData = "";
            req.on('data', function (chunk) {
                jsonData += chunk;
            });
            req.on('end', function () {
                var reqObj = JSON.parse(jsonData);
                console.log(reqObj);
                // Now put it into the database
                comments.addComment(reqObj);
                // Now return the current comments
                res.writeHead(200);
                res.end(JSON.stringify(comments.getComments()));
            });
        } else if (req.method === "GET") {
            console.log("GET comment route");
            res.writeHead(200);
            res.end(JSON.stringify(comments.getComments()));
        }
    } else {
        fs.readFile(ROOT_DIR + urlObj.pathname, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(3000);
console.log('Server running on port 3000');
