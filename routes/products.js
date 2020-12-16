var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

var User = require('../models/User');
var Product = require('../models/Product');
var Review = require('../models/Review');
var Cart = require('../models/Cart');

var multer = require('multer');
var path = require('path');
var uploadPath = path.join(__dirname,'../','public/upload');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null,   Date.now() + '-' +file.originalname)
  }
})
var upload = multer({ storage: storage })

// add product
router.get('/new',auth.verifyUserAdmin,(req,res)=>{
    res.render("addProduct");
});

// list products
router.get('/',(req,res, next)=>{
    if(req.query.category){
        Product.find({category:req.query.category},(err,products)=>{
            res.render('listProducts',{ message: req.flash('Error'),user: req.user, products});
        })
    }else if(req.query.price){
        if(req.query.price==='LowToHigh'){
            Product.find({}).sort({price: 1}).exec((err, products) => {
                res.render('listProducts',{ message: req.flash('Error'),user: req.user, products});
            })
        }
        if(req.query.price==='HighToLow'){
            Product.find({}).sort({price: -1}).exec((err, products) => {
                res.render('listProducts',{ message: req.flash('Error'),user: req.user, products});
            })
        }
    }else if(req.query.name){
        Product.find({ name : { $regex: new RegExp(`${req.query.name}`), $options: 'ig' } },(err,products)=>{
            res.render('listProducts',{ message: req.flash('Error'),user: req.user, products});
        })
    }
    
    
    else{
        Product.find({},(err, products) => {
            res.render('listProducts',{ message: req.flash('Error'),user: req.user, products});
        })
    }
})
// post product
router.post('/',upload.single('image'),(req,res,next)=>{
    if(req.file && req.file.filename){
        req.body.image = req.file.filename;
    }
    req.body.author = req.session.userId; 
    Product.create(req.body, (err,product)=>{
        if(err) return next(err);
        res.redirect('/products');
    })
})
// single product
router.get('/:productId',(req,res,next)=>{
    let productId = req.params.productId;
    Product.findById(productId)
    .populate('author', 'name email')
    .populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).exec( (err,product)=>{
        res.render('singleProduct',{products:product,user: req.user})
    })
})
// delete products
router.get('/:productId/delete',auth.verifyUserLogin, (req,res,next)=>{
    var productId = req.params.productId;
    Product.findById(productId, (err,product)=>{
        var adminId = product.author.toString();
        if(req.user._id == adminId){
            Product.findByIdAndDelete(productId, (err, product)=>{
                res.redirect('/products')
            })
        }else{
            req.flash('Error', "Unauthorised")
            res.redirect('/products')
        }
    })
})
// product update

router.get('/:productId/update',auth.verifyUserLogin, (req,res,next)=>{
    var productId = req.params.productId;
    Product.findById(productId, (err,products)=>{
        var adminId = products.author.toString();
        if(req.user._id == adminId){
            res.render('updateProduct', {products})
        }else{
            req.flash('Error', "Unauthorised")
            res.redirect('/products')
        }

    })
})

router.post('/:productId/update',upload.single('image'), (req,res,next)=>{
    if(req.file && req.file.filename){
        req.body.image = req.file.filename;
    }
    var productId = req.params.productId;
    Product.findByIdAndUpdate(productId,req.body,{new:true},(err,product)=>{
        if(err) return next(err);
        res.redirect('/products')
    })
})


// likes
router.get('/:productId/likes', function(req,res,next){
    let productId = req.params.productId;
    Product.findById(productId,(err,products)=>{
        if(err) return next(err);
        if(products.likesUser.includes(req.user.id)){
            products.likes = products.likes -1;
            products.likesUser = products.likesUser.pull(req.user.id);
        } else{
            products.likes = products.likes + 1;
            products.likesUser = products.likesUser.push(req.user.id);
        }
        Product.findByIdAndUpdate(productId, products, (err, updatedProduct) =>{
            if(err) return next(err);
            res.redirect(`/products/${products.id}`);
        });
    })
})


// add Reviews
router.post('/:productId/reviews', function(req,res,next){
    var productId = req.params.productId;
    req.body.productId = productId;
    req.body.author = req.user.id;
    Review.create(req.body, (err,review)=>{
        if(err) return next(err);
        Product.findByIdAndUpdate(productId,{$push: {reviews : review._id}},(err, review)=>{
            res.redirect(`/products/${productId}`);
        })
    })
})


// add cart
router.get('/:productId/cart',(req,res,next)=>{
    var productId = req.params.productId;
    let userId = req.user.id;
    req.body.cartProduct = productId;
    req.body.cartOwner = userId;
    Cart.create(req.body, (err,cart)=>{
        if(err) return next(err);
        User.findByIdAndUpdate(userId,{$push:{cartList:cart.id}},(err, cart)=>{
            res.redirect(`/products/${productId}`);
        })
    })
})


module.exports = router;