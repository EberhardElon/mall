let http=require("https");
let util=require("util");

http.get("https://www.imooc.com/search/hotwords",(res)=>{
  console.log(res.statusCode);
  let result='';
  res.on("data",(chunk)=>{
    result+=chunk;
    console.log(JSON.parse(chunk).data[2]);
  }).on("error",(e)=>{

    console.log(e);
  });

});

