const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

//Routers
const productRoutes = express.Router();
const Product = require('./model/product.model');


app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://elainedau:zNb6QI1UPPWSIt94@cluster0.xdo1f9i.mongodb.net/?retryWrites=true&w=majority",
{useNewUrlParser:true});

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("DB connected......")
})

//Define the routes for handling all CRUD operations.
//get all Products
/* productRoutes.route('/api/products').get((req, res) => {
    Product.find()
      .then(products=>res.status(200).json(products))
      .catch(err=>res.status(400).json({"error": err}))
}); */

//get Products by id
productRoutes.route('/api/products/:id').get((req,res)=>{
    Product.findById(req.params.id)
      .then(products=>res.status(200).json(products))
      .catch(err=>res.status(400).json({"error": err}))
});

//add new Product
productRoutes.route('/api/products').post((req,res)=>{
    let products = new Product(req.body)
    products.save()
      .then(products=>res.status(200).json(products))
      .catch(err=>res.status(400).json({"error": err}))
});


//update Product by id
productRoutes.route('/api/products/:id').put(async (req,res)=>{
    let products = await Product.findById(req.params.id);
    if(!products) return res.status(404).json({message: 'Product not found'});
    
    Object.assign(products, req.body);
    await products.save()
      .then(products=>res.status(200).json(products))
      .catch(err=>res.status(400).json({"error": err}))    
});

//remove product by id
productRoutes.route('/api/products/:id').delete(async(req,res)=>{
    let products = await Product.findByIdAndDelete(req.params.id)
      .then(res.status(200).json('Product ID:'+req.params.id+' deleted'));
    if(!products) return res.status(404).json({message: 'Product not found'});
});

//remove all Products
productRoutes.route('/api/products').delete((req,res)=>{
    Product.deleteMany()
      .then(res.status(200).json('All products deleted'))
      .catch(err=>res.status(400).json({"error": err}))
});

//find all Products which name contains 'kw'
productRoutes.route('/api/products').get((req,res)=>{
    let keyword = req.query.name;
    if (keyword) {
        Product.find({name: new RegExp(keyword, 'i')})
          .then(products => res.status(200).json(products))
          .catch(err=>res.status(400).json({"error": err}))
    } else {
        //get all Products
        Product.find()
          .then(products => res.status(200).json(products))
          .catch(err=>res.status(400).json({"error": err}))
    }
});


app.use(productRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to DressStore application." });
});

app.listen(8080,()=>{
    console.log("Server is running on 8080....");
    console.log("http://localhost:8080/");
});