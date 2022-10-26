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
    imgModel                = require("./models/image"),
    flash                   = require("connect-flash")
var commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/posts"),
    indexRoutes             = require("./routes/index"),
    multer                  = require('multer'),
    path                    = require('path'),
    fs                      = require('fs');

var pURL = "";

const dotenv = require('dotenv');
dotenv.config();
console.log("Env variable "+ process.env.GOOGLE_APPLICATION_CREDENTIALS);
const {format} =     require('util');
const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

const URL = "mongodb+srv://userZaid:Qcyfz3aRyRmEvpMq@cluster0.cm0aw.mongodb.net/Connect?retryWrites=true&w=majority"
// Making a connection to the database
// mongoose.connect('mongodb://localhost/yelp_camp', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

// APP.USE
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(flash());

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

// message flashing
app.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// making a var req.user publically accessible
app.use(function(req,res,next){

    if(req.user){
        
        res.locals.currentUser = req.user;
        res.locals.imagelink = pURL;

        var dp = {};
        imgModel.findById(req.user.images, function(err,image){
                if(err)
                    console.log(err)
                else{
                    // dp  = image
                    res.locals.images = image
                    console.log(image)
                    next();
                    // console.log(image)
                }    // res.render("index", {images:images});
            });
    }    
    else{
        res.locals.currentUser = req.user;
        // console.log(req.user);
        next();
    }
 
});


// getting all the users in the app till now
var users = []

User.find({},function(err,names){
    
    names.forEach(function(name){
        users.push(name)
        // console.log(name.username)
    });
    // exclude the current signed in user
    console.log(users)
    // if(name.username==)

});

app.use( function(req,res,next) {

    res.locals.users = users;
    next();
});


// Getting routes from routes dir
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(commentRoutes)


// // Uploading image stuff
// const current_path = path.join(__dirname, "uploads");

// app.use('/uploads', express.static('uploads')); // to serve uploaded images!!!

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
// })


// var upload = multer({
//      storage: storage 
// })

// multer gcp bucket integration
const Multer = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 20 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
  });
  
const bucket = storage.bucket("connect-326117.appspot.com");


// SEEDING
// seedDB();

// ROUTES


// Image Upload Stuff
app.get("/changePic", function(req,res){
    res.render("profile_pics/upload_image");

});


app.post('/changePic', Multer.single('profile-pic'), (req, res, next) => {
   
    // console.log(req.user);
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        next(err);
    });


    blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format( `https://storage.googleapis.com/${bucket.name}/${blob.name}`);

    pURL  = publicUrl;
    console.log(pURL); 
    res.locals.imagelink = pURL;
    // res.status(200).send(publicUrl);
    });

    blobStream.end(req.file.buffer);

    var obj = {
            img: pURL
        }
    
    console.log(`OBject is ${obj}`);

    User.findById(req.user._id , function(err,user){
       
        // remove the previios profile pic!!
        // also try to clear the cloud storage bucket!!
        imgModel.remove({},function(err){
            if(err)
                console.log(err)
            else
                console.log("Image model for this user is deleted!");
        });

        imgModel.create(obj, (err, image) => {
            if (err) {
                console.log(err);
            }
            else {
                // item.save();
                console.log("created uimage objecet and saving it to db!!");
                console.log(image);
                user.images.push(image);
                user.save();
                image.save();
                // console.log("Image saved to db!! ")
                res.redirect('/campgrounds');

                // res.render("uploads",{images:images})
            }
        });
    });
});



const PORT = process.env.PORT || 8080;
// Server srutff
app.listen(PORT, function () {
    console.log("Server has started"); 
});


// // // for hosting purpose!!
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Yelpcamp server has started!")
// });



