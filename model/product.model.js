const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number
    },
    category:{
        type:String
    }
});

module.exports = mongoose.model('Product',Product);