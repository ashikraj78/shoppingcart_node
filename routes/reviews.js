var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');

var User = require('../models/User');
var Product = require('../models/Product');
var Review = require('../models/Review');


// delete review 
router.get('/:reviewId/delete',function(req,res,next){
    var reviewId = req.params.reviewId;
    Review.findByIdAndDelete(reviewId,(err,review)=>{
        res.redirect("/products/"+review.productId)
    })
})

// edit review

router.get('/:reviewId/edit',(req,res,next)=>{
    var reviewId = req.params.reviewId;
    Review.findById(reviewId,{content:1},(err,review)=>{
        if(err) return next(err);
        res.render('editReview',{review})
    })
})

router.post("/:reviewId/edit", function(req,res,next){
    var reviewId = req.params.reviewId;
    Review.findByIdAndUpdate(reviewId, req.body, {new:true},(err,review)=>{
        res.redirect("/products/"+review.productId)
    })
})





module.exports= router;