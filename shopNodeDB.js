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
const port = process.env.port || 2410;
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
      let newbody = { ...body, shopId: newId }
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
      let newbody = { ...body, productId: newId };
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
      result = shop ? filterParams(result, 'shopId', shop) : result
      result = product ? filterParams(result, 'productid', product) : result

      result = sort === 'QtyAsc' ? result.sort((p1, p2) => (+p1.quantity) - (+p2.quantity)) : result
      result = sort === 'QtyDesc' ? result.sort((p1, p2) => (+p2.quantity) - (+p1.quantity)) : result
      result = sort === 'ValueAsc' ? result.sort((p1, p2) => (+p1.price * +p1.quantity) - (+p2.price * +p2.quantity)) : result
      result = sort === 'ValueDesc' ? result.sort((p1, p2) => (+p2.price * +p2.quantity) - (+p1.price * +p1.quantity)) : result
      res.send(result);
    }
  })
})

filterParams = (arr, name, value) => {
  if (!value) return arr;
  let ValueArr = value.split(",")
  let arr1 = arr.filter((a1) => ValueArr.find((val) => val == a1[name]));
  console.log(arr1)
  return arr1;
}



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


app.put("/products/:id", function (req, res) {
  let body = req.body;
  let id = req.params.id
  console.log(id)
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(404).send(err)
    else {
      let Array = JSON.parse(data)
      let index = Array.products.findIndex((st) => st.productId == id);
      if (index >= 0) {
        let upDated = { ...Array.products[index], ...body };
        Array.products[index] = upDated;
        let data1 = JSON.stringify(Array)
        fs.writeFile(fname, data1, function (err) {
          if (err) res.status(404).send(err)
          else res.send(upDated)
        })
      }
      else res.status(404).send("Product Not Found")
    }
  })
})




app.get("/totalPurchases/shops/:id", function (req, res) {
  let id = req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(400).send(err)
    else {
      let Array = JSON.parse(data)
      let result = Array.purchases
      let shops = result.filter((ele) => ele.shopId == id)
      let arr1 = shops.reduce((acc, curr) => {
        let index = acc.findIndex((a1) => a1.productid == curr.productid)
        if (index == -1) acc.push(curr)
        else acc[index].quantity = acc[index].quantity + curr.quantity
        return acc;
      }, [])
      res.send(arr1)
    }
  })
})


app.get("/totalPurchases/Products/:id", function (req, res) {
  let id = req.params.id;
  fs.readFile(fname, "utf-8", function (err, data) {
    if (err) res.status(400).send(err)
    else {
      let Array = JSON.parse(data)
      let result = Array.purchases
      let shops = result.filter((ele) => ele.productid == id)
      let arr1 = shops.reduce((acc, curr) => {
        let index = acc.findIndex((a1) => a1.shopId == curr.shopId)
        if (index == -1) acc.push(curr)
        else acc[index].quantity = acc[index].quantity + curr.quantity
        return acc;
      },[])
      res.send(arr1)
    }
  })
})

