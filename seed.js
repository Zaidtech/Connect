const mongoose  = require('mongoose');
var Campgrounds = require("./models/campground");
var Comment     = require("./models/comment");
var Dp          = require('./models/image');
// Seed data
var data = [
    {
        name: "Clouds Heaven",
        image : "https://www.minuteschool.com/wp-content/uploads/2019/07/blog_campping.jpeg",
        description: "Do ea ex enim ea. Incididunt id commodo nisi veniam do exercitation ullamco. Eiusmod aliquip id eu Lorem velit occaecat duis. Dolor duis sit nulla pariatur pariatur aute occaecat aliqua nostrud eu incididunt elit ad minim. Duis voluptate fugiat est consectetur aliquip ea excepteur laboris irure."
    },
    {
        name: "Tree place ",
        image : "https://images.indulgexpress.com/uploads/user/imagelibrary/2019/10/24/original/Camp_diaries.jpg",
        description: "Do ea ex enim ea. Incididunt id commodo nisi veniam do exercitation ullamco. Eiusmod aliquip id eu Lorem velit occaecat duis. Dolor duis sit nulla pariatur pariatur aute occaecat aliqua nostrud eu incididunt elit ad minim. Duis voluptate fugiat est consectetur aliquip ea excepteur laboris irure."
    },
    {
        name: "Mountains view",
        image : "https://cms.accuweather.com/wp-content/uploads/2019/03/camping-thumbnail.11.4920AM.png",
        description: "Do ea ex enim ea. Incididunt id commodo nisi veniam do exercitation ullamco. Eiusmod aliquip id eu Lorem velit occaecat duis. Dolor duis sit nulla pariatur pariatur aute occaecat aliqua nostrud eu incididunt elit ad minim. Duis voluptate fugiat est consectetur aliquip ea excepteur laboris irure."
    }
]
 
function seedDB(){

    Comment.remove({},function(err){
        if(err)
            console.log(err)
        else
            console.log("Comments cleared!!");
    });

    
    // Removong campgrounds!!
    Campgrounds.remove({},function(err){
        
        if(err){
            console.log(err)
        }   
        
        // console.log("DB cleared \n Feeding data.....");
        // iterate over each item/seed
        data.forEach(function(seed){    
            Campgrounds.create(seed,function(err,campground){
                if(err){
                    console.log(err)
                }
                else{
                    // console.log("Data added to db!!");
                   // Create comments for the added campground
                     Comment.create({
                         text   : "this place is wonderful, hope we had internet here!!!",
                         author : "Zaid"
                     },function(err,comment){
                        if(err)
                            console.log(err);
                        else{
                            campground.comments.push(comment);
                            campground.save();
                            // console.log("Comment created to the post") 
                        }
                     });
                }
            });
        });    
    });
    // Add campgrounds!!
    //  Add  comments
}

module.exports = seedDB;