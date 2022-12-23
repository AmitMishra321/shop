var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
const port = process.env.port||2410;
app.listen(port, () => console.log(`Node app listen port ${port}!`))

let { Data } = require("./shopData.js")
let fs = require("fs")
let fname = "shop.json"
let data = JSON.stringify(Data)


app.get("/svr/resetData", function (req, res) {
  fs.writeFile(fname, data, function (err) {
    if (err) res.status(404).send(err)
    else res.send("Data infile is reset")
  })
})


app.get("/shops", function (req, res) {
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err)
    else {
      let Array = JSON.parse(data)
      res.send(Array.shops);
    }
  })
})


app.post("/shops", function (req, res) {
  let body = req.body;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err)
    else {
      let Array = JSON.parse(data)
      let maxId = Array.shops.reduce((acc, curr) => curr.shopId > acc ? curr.shopId : acc, 0)
      let newId = maxId + 1
      let newbody = { ...body, shopid: newId }
      Array.shops.push(newbody)
      let data1 = JSON.stringify(Array)
      fs.writeFile(fname, data1, function (err) {
        if (err) res.status(404).send(err)
        else res.send(newbody)
      })
    }
  })
})


app.get("/products", function (req, res) {
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err)
    else {
      let Array = JSON.parse(data)
      res.send(Array.products);
    }
  })
})

app.post("/products", function (req, res) {
  let body = req.body;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(200).send(err)
    else {
      let Array = JSON.parse(data)
      let maxId = Array.products.reduce((acc, curr) => curr.productId > acc ? curr.productId : acc, 0)
      let newId = maxId + 1;
      let newbody = { ...body, newId };
      Array.products.push(newbody)
      let data1 = JSON.stringify(Array)
      fs.writeFile(fname, data1, function (err) {
        if (err) res.status(400).send(err)
        else res.send(newbody)
      })
    }
  })
})

app.get("/products/:id", function (req, res) {
  let id = req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(400).send(err)
    else {
      let Array = JSON.parse(data)
      let product = Array.products.find((ele) => ele.productId == id)
      // console.log(product)
      res.send(product)
    }
  })
})



app.get("/purchases", function (req, res) {
  let shop = req.query.shop;
  let product = req.query.product
  let sort = req.query.sort
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err)
    else {
      let Array = JSON.parse(data)
      let result = Array.purchases
      result = shop ? result.filter((ele) => ele.shopId == shop)
        : result
      result = product ? result.filter((ele) => ele.productid == product)
        : result
      result=sort==='QtyAsc'?result.sort((p1,p2)=>(+p1. quantity)-(+p2. quantity)):result
      result=sort==='QtyDesc'?result.sort((p1,p2)=>(+p2. quantity)-(+p1.quantity)):result
      result=sort==='ValueAsc'?result.sort((p1,p2)=>(+p1.price*+p1. quantity)-(+p2.price*+p2. quantity)):result
      result=sort==='ValueDesc'?result.sort((p1,p2)=>(+p2.price*+p2. quantity)-(+p1.price*+p1. quantity)):result
      res.send(result);
    }
  })
})


app.get("/purchases/shops/:id", function (req, res) {
  id = req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err)
    else {
      let Array = JSON.parse(data)
      let shop = Array.purchases.filter((ele) => ele.shopId == id)
      res.send(shop);
    }
  })
})

app.get("/purchases/products/:id", function (req, res) {
  id = req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err)
    else {
      let Array = JSON.parse(data)
      let shop = Array.purchases.filter((ele) => ele.productid == id)
      res.send(shop);
    }
  })
})


app.get("/totalPurchase/shop/:id –", function (req, res) {
  id = req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err)
    else {
      let Array = JSON.parse(data)
      let shop = Array.purchases.filter((ele) => ele.shopId == id)
      let arr=shop.reduce((acc,curr)=>acc.find((ele)=>ele.productid==curr.ele.productid)?acc:{productid:curr.productid,})
      res.send(shop);
    }
  })
})


app.post("/purchases", function (req, res) {
  let body = req.body;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(200).send(err)
    else {
      let Array = JSON.parse(data)
      let maxId = Array.purchases.reduce((acc, curr) => curr.purchaseId > acc ? curr.purchaseId : acc, 0)
      let purchaseId = maxId + 1;
      let newbody = { ...body, purchaseId };
      Array.purchases.push(newbody)
      let data1 = JSON.stringify(Array)
      fs.writeFile(fname, data1, function (err) {
        if (err) res.status(400).send(err)
        else res.send(newbody)
      })
    }
  })
})


app.put("/products/:id",function(req,res){
  let body=req.body;
  let id= req.params.id
  console.log(id)
  fs.readFile(fname,"utf-8",function(err,data){
    if(err) res.status(404).send(err)
    else{
      let Array=JSON.parse(data)
      let index=Array.products.findIndex((st)=>st.productId==id);
      console.log('1',index)
      if(index>=0){
        let upDated={...Array.products[index],...body};
        console.log(upDated)
        Array.products[index]=upDated;
        let data1=JSON.stringify(Array)
        fs.writeFile(fname,data1,function(err){
          if(err) res.status(404).send(err)
          else res.send(upDated)
        })
      }
      else res.status(404).send("Product Not Found")
    }
  })
})
