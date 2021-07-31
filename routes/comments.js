var express  = require('express')
var router   = express.Router()
var Campground = require("../models/campground")
var Comment   = require("../models/comment")




// Commments stuff
router.get("/campgrounds/:id/comment/new", isLoggedIn, function(req,res){
   
    Campground.findById(req.params.id, function(err, campground){
 
     // console.log(campground)
     // console.log(campground._id)
     if(err)
         console.log(err)
     else
         res.render("comments/new_comment", {campground: campground});  
    });
 });
 
 
router.post("/campgrounds/:id/comments", isLoggedIn,function(req,res){    
     // add somehow the date !!
     console.log(req.body.comment)
     
     Campground.findById(req.params.id, function(err,campground){
        
         Comment.create(req.body.comment,function(err,comment){
             if(err)
                 console.log(err)
             else{
                                 
                 // console.log("new comment added to the db!!");
                 campground.comments.push(comment);
                 campground.save();
             }
         });
         res.redirect(`/campgrounds/${ req.params.id}`);
     });
 });


// works as a middleware !! 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


 
module.exports   = router

