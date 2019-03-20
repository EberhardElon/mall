var express = require('express');
var router = express.Router();
require("./../util/util");
var mongoose = require('mongoose');
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//登录接口
router.post('/login', (req, res, next) => {
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;
  let params = {
    userName: userName,
    userPwd: userPwd
  };
  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        });
      } else {
        res.json({
          status: '1',
          msg: ''
        });
      }
    }
  });
});

//登出接口
router.post("/logout", (req, res, next) => {
  res.cookie("userName", "", {
    path: "/",
    maxAge: -1
  });
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  });
  res.json({
    status: "0",
    msg: '',
    result: ''
  });
});

//刷新或打开网页时检查用户是否登录过
router.post("/checkLogin", (req, res, next) => {
  if (req.cookies.userName) {
    res.json({
      status: '0',
      msg: '',
      result: {
        userName: req.cookies.userName
      }
    });
  } else {
    res.json({
      status: '1',
      msg: '未登录'
    });
  }
});

//获取用户购物车信息
router.get("/cartlist", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: '',
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: {
            cartlist: doc.cartList
          }
        });
      }
    }
  });
});

//购物车删除商品
router.post("/delCart", (req, res, next) => {
  var productId = req.body.productId, userId = req.cookies.userId;
  User.update({userId: userId}, {$pull: {cartList: {productId: productId}}}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      });
    }
  });
});

//更改购物车数据
router.post("/editCart", (req, res, next) => {
  var productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked,
    userId = req.cookies.userId;
  User.update({userId: userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum, 'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      });
    }
  });
});

//全选状态更新
router.post('/checkAll', (req, res, next) => {
  var userId = req.cookies.userId,
    checked = req.body.checkAll;
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.messages,
        result: ''
      });
    } else {
      if (userDoc) {
        userDoc.cartList.forEach((item) => {
          item.checked = checked;
        });
        userDoc.save((err1, doc) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err.messages,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        });
      }
    }
  });
});

//用户地址查询接口
router.get("/addressList", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      });
    }
  });
});

//设置默认地址接口
router.post("/setDefault", (req, res, next) => {
  var addressId = req.body.addressId,
    userId = req.cookies.userId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'address is null',
      result: ''
    });
  } else {
    User.findOne({"userId": userId}, (err1, doc) => {
      if (err1) {
        res.json({
          status: '1',
          msg: err1.message,
          result: ''
        })
      } else {
        var addressList = doc.addressList;
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        });
        doc.save((err2, doc2) => {
          if (err2) {
            res.json({
              status: '1',
              msg: err2.message,
              result: ''
            });
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        });
      }
    })
  }
});

//删除地址接口
router.post('/delAddress', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.update({userId: userId}, {
    $pull: {
      addressList: {
        addressId: addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: "suc"
      });
    }
  });
});

//获取订单信息
router.get("/orderConfirm", (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: userDoc.cartList
      });
    }

  });
});

//订单提交确认
router.post("/payment",(req,res,next)=>{
  var addressId=req.body.addressId,
    orderTotal=req.body.orderTotal,
    userId=req.cookies.userId;
  User.findOne({userId:userId},(err1,userDoc)=>{
    if(err1){
      res.json({
        status:'1',
        msg:err1.messages,
        result:''
      });
    }else{
      var address='',goodsList='';
      userDoc.addressList.forEach((item)=>{
        if(item.addressId==addressId){
          address=item;
        }
      });

      userDoc.cartList.filter((item)=>{
        if(item.checked=='1'){
          goodsList=item;
        }
      });

      var platform='522';
      var r1=Math.floor(Math.random()*10);
      var r2=Math.floor(Math.random()*10);
      var sysDate=new Date().Format('yyyyMMddhhss');
      var createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId=sysDate+r1+platform+r2;

      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };

      userDoc.orderList.push(order);

      userDoc.save((err2,doc)=>{
        if(err2){
          res.json({
            status:'1',
            msg:err2.messages,
            result:''
          });
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          });
        }
      });

    }
  });
});

//订单展示数据
router.get("/orderSuccess",(req,res,next)=>{
  var orderId=req.param("orderId"),
    userId=req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc.orderList.length>0){
        var orderTotal=0;
        console.log(orderId);
        doc.orderList.forEach((item)=>{
          console.log(item.orderId)
          if(orderId==item.orderId){
            orderTotal=item.orderTotal;
          }
        });
        if(orderTotal){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          });
        }else{
          res.json({
            status:'1001',
            msg:'无此订单',
            result:''
          });
        }

      }else{
        res.json({
          status:'1002',
          msg:'用户没有订单',
          result:''
        });
      }

    }
  });
});

//查询购物车数量接口
router.get("/cartCount",(req,res,next)=>{
  if(req.cookies.userId){
    User.findOne({userId:req.cookies.userId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else {
        var cartCount=0;
        doc.cartList.map((item)=>{
          cartCount+=parseInt(item.productNum);
        });
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        });
      }
    })
  }
});

module.exports = router;
