var express  = require('express')
var router   = express.Router()
var User     = require("../models/user")
var passport = require('passport');
// Middleares here
var middleWareObj = {};



middleWareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    
    req.flash("error", "Please login first.");
    res.redirect("/login");
}




module.exports = middleWareObj