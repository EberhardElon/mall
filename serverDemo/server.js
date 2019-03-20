let http = require("http");
let url = require("url");
let fs = require("fs");

let server = http.createServer((req, res) => {
  var pathName = url.parse(req.url).pathname;
  fs.readFile(pathName.substr(1), (err, data) => {
    if (err) {
      res.writeHeader(404, {
        "Content-Type": "text/html"
      });
    } else {
      res.writeHeader(200, {
        "Content-Type": "text/html",
      });
      res.write(data.toString());
    }
    res.end();
  });
});

server.listen(3001,'127.0.0.1',()=>{
  console.log("OK");
});
