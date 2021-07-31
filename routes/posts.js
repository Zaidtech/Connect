var express  = require('express')
var router   = express.Router()
var Campground = require("../models/campground")

// NEW Route to display form
router.get("/new",isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// GET route to display all campgrounds
router.get("/", isLoggedIn,function (req, res) {

    Campground.find({}, function (err, campgrounds) {
        if (err) {
            res.render(err);
            // console.log(err);
        }
        else {
            // console.log(campgrounds);
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// get called when form is submitted and redirect to display all data
// CREATE route to get form data and add it to the database
router.post('/',  isLoggedIn,function (req, res) {

    // res.send("You hit post route!!"); 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var user   = {
        id  : req.user._id,
        username : req.user.username
    }

    var newCampground = { name: name, image: image, description:desc, user:user };

    console.log(req.user)

    Campground.create(newCampground, function (err, result) {
        if (err)
            console.log(err);
        else {
            console.log("Added a new campground to the database");
            res.redirect('/campgrounds');
        }
    });

});


// This route must be before the /new one as :id corresponds to anything
// SHOW -- to get more info
router.get("/:id", isLoggedIn, function (req, res) {

    Campground.findById(req.params.id).populate("comments").exec(
        function(err,foundcamp){
            if(err)
                console.log(err);
            else{
                res.render("campgrounds/show",{campground:foundcamp});
                // console.log(foundcamp);
            }
            });

    // res.render("show");
    // res.send(`This will be the show page for the given tag`);
});


// works as a middleware !! 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;