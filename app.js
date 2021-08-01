// Requirements and importing models
var express                 = require('express'),
    app                     = express(),
    bodyParser              = require('body-parser'),
    mongoose                = require('mongoose'),
    Campground              = require('./models/campground'), 
    seedDB                  = require('./seed'),
    Comment                 = require('./models/comment'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    User                    = require("./models/user"),
    imgModel                = require("./models/image")
    
var commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/posts"),
    indexRoutes             = require("./routes/index"),
    multer                  = require('multer'),
    path                    = require('path'),
    fs                      = require('fs');


// Making a connection to the database
mongoose.connect('mongodb://localhost/yelp_camp', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

// APP.USE
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))


// express session
app.use(require('express-session')({
    secret : "The snake is flying on pencil nose!!",
    resave : false,
    saveUninitialized:false
}));

// Passport config

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// making a var req.user publically accessible
app.use(function(req,res,next){

    if(req.user){
        
        res.locals.currentUser = req.user;

        var dp = {};
        imgModel.findById(req.user.images, function(err,image){
                if(err)
                    console.log(err)
                else{
                    dp  = image
                    res.locals.images = image
                    next();
                    // console.log(image)
                }    // res.render("index", {images:images});
            });
    }    
    else{
        res.locals.currentUser = req.user;
        console.log(req.user);
        next();
    }
});


// Getting routes from routes dir
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(commentRoutes)


// Uploading image stuff
const current_path = path.join(__dirname, "uploads");

app.use('/uploads', express.static('uploads')); // to serve uploaded images!!!

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({
     storage: storage 
})


// SEEDING
// seedDB();

// ROUTES

// Image Upload Stuff
app.get("/changePic", function(req,res){
    res.render("profile_pics/upload_image");

});


app.post('/changePic', upload.single('profile-pic'), (req, res, next) => {
   
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    User.findById(req.user._id , function(err,user){
       
        // remove the previios profile pic!!
        imgModel.remove({},function(err){
            if(err)
                console.log(err)
            else
                console.log("")
        });

        imgModel.create(obj, (err, image) => {
            if (err) {
                console.log(err);
            }
            else {
                // item.save();
                
                user.images.push(image);
                user.save();
                // console.log("Image saved to db!! ")
                res.redirect('/campgrounds');

                // res.render("uploads",{images:images})
            }
        });
    });
});


// Server srutff
app.listen(2000, function () {
    console.log("Server has started"); 
});


// for hosting purpose!!
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Yelpcamp server has started!")
// });



