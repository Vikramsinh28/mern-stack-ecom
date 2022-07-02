const express = require("express");  // requiring express module
require('./db/config')   // connenction 
const User = require("./db/User") // given db  specific model
const Product = require("./db/Product") 
const cors = require("cors");
const app = express();

const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';

app.use(express.json()); 
app.use(cors());

app.post("/register" , async (req , res)=> {
    let user =  new User(req.body);
    let result =await user.save();
    res.send(result);
});
app.post("/login" ,  async(req , res)=>{
    console.log(req.body)
    if(req.body.password && req.body.email){
        let user = await User.findOne(req.body).select("-password");
        if(user){
            Jwt.sign( )
            res.send(user)
        }else{
            res.send("User not Found")
        }
    }else{
        console.log("Insert Both data")
    }

});

app.post("/add-product" ,async (req , res)=> {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
})

app.get("/products" , async (req , res) => {
   let products = await Product.find();
   if(products.length > 0){
    res.send(products)
   }
   else{
    res.send({result : "Np products are found"})
   }
})

app.delete("/product/:id" ,  async(req , res) => {
      res.send(req.params.id) 
      const result = await Product.deleteOne({_id : req.params.id})
      res.send(result)
})

app.get("/search/:key" , async(req ,res)=> {
    let result = await Product.find({
        "$or" : [
            {name : {$regex : req.params.key}},
            {company : {$regex : req.params.key}},
            {category : {$regex : req.params.key}},
        ]
    });
    res.send(result)
});

app.get("/" , (req , res)=> {
    res.send("App is running...")
});
app.listen(4000);