var user = require("./User");
let util = require("util");
let http = require('http');
let url=require('url');

let server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type","text/plain;charset=utf-8");
  res.setHeader("Cache-Control","no-store");
console.log(url.parse(req.url));
  res.end(util.inspect(url.parse('http://localhost:3000/index.html?name=55')));
});

server.listen(3000, '127.0.0.1', () => {
  console.log("OK");
});
