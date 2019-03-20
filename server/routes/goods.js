var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('./../models/goods');
var User = require('../models/user');

//链接mongodb
mongoose.connect("mongodb://127.0.0.1:27017/dumall", {useNewUrlParser: true});
mongoose.connection.on("connected", () => {
  console.log("connect success");
});
mongoose.connection.on("error", (e) => {
  console.log("connect error    " + e);
});
mongoose.connection.on("dixconnected", () => {
  console.log("disconnect");
});

//显示商品，获取商品信息
router.get('/', (req, res, next) => {
  let sort = req.param("sort");
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let skip = (page - 1) * pageSize;
  let priceLevel = req.param("priceLevel");
  let startPrice, endPrice;
  let param = {};
  if (priceLevel != "All") {
    switch (priceLevel) {
      case "0":
        startPrice = 0;
        endPrice = 100;
        break;
      case "1":
        startPrice = 100;
        endPrice = 500;
        break;
      case "2":
        startPrice = 500;
        endPrice = 1000;
        break;
      case "3":
        startPrice = 1000;
        endPrice = 2000;
        break;
    }
    param = {
      "salePrice": {
        $gt: startPrice,
        $lte: endPrice
      }
    }
  }

  let goodsList = Goods.find(param).skip(skip).limit(pageSize);
  goodsList.sort({"salePrice": sort});

  goodsList.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        meg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});

//加入购物车
router.post("/addCart", (req, res, next) => {
  var productId = req.body.productId, userId = '100000077';
  User.findOne({'userId': userId}, (err1, userDoc) => {
    if (err1) {
      res.json({
        status: '1',
        msg: err1.message
      });
    } else {
      if (userDoc) {
        var goodItem='';
        userDoc.cartList.forEach((item)=>{
          if(item.productId==productId){
            goodItem=item;
            item.productNum++;
          }
        });
        if(goodItem){
          userDoc.save((err, doc) => {
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              });
            } else {
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              });
            }
          })
        }else {
          Goods.findOne({"productId": productId}, (err2, goodsDoc) => {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message
              });
            } else {
              if (goodsDoc) {
                console.log(goodsDoc);
                var obj=goodsDoc.toObject();
                obj.productNum = 1,
                  obj.checked = 1,
                  userDoc.cartList.push(obj),
                  console.log(goodsDoc);
                userDoc.save((err, doc) => {
                  if (err) {
                    res.json({
                      status: '1',
                      msg: err.message
                    });
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    });
                  }
                })
              }
            }
          });
        }

      }
    }
  });

});

module.exports = router;
