var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

var User = require('../models/User');
var Product = require('../models/Product');
var Review = require('../models/Review');
var Cart = require('../models/Cart');


// display all carts items 

router.get('/', (req,res,next)=>{
    let cartOwner = req.user.id;
    Cart.find({cartOwner}).populate('cartProduct','name category price image').exec((err,carts)=>{
        console.log(carts)
        res.render('cart',{carts});
    })
})

// delete cart item
router.get('/:cartId/delete', (req,res,next)=>{
    let cartId = req.params.cartId;
    let userId = req.user.id;
    Cart.findByIdAndDelete(cartId, (err, cart)=>{
        if(err) return next(err);
        User.findByIdAndUpdate(userId,{$pull:{cartList:cart.id}},(err,carts)=>{
            res.redirect('/carts')
        })
    })
} )

// edit cart Item
router.get('/:cartId/edit',(req,res,next)=>{
    var cartId = req.params.cartId;
    Cart.findById(cartId,{numberOfItem:1},(err,cart)=>{
        if(err) return next(err);
        res.render('editCartItem',{cart})
    })
})
router.post('/:cartId/edit',(req,res,next)=>{
    var cartId = req.params.cartId;
    Cart.findByIdAndUpdate(cartId,req.body,{new:true},(err,cart)=>{
        res.redirect('/carts');
    })
})




module.exports= router;
