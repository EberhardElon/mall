var mongoose = require('mongoose');
var productsSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  salePrice: Number,
  productImage: String,
  productUrl: String
});

module.exports=mongoose.model("Good",productsSchema);
