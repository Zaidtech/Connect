const mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
    name    : String,
    image   : String,
    description: String,
    user    :{
        id: {
            type  : mongoose.Schema.Types.ObjectId,
            ref   : "User"
        },
        username : String
    },

    comments:  [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref  : "Comment"
        }
    ]
});

// exporting the model
module.exports = mongoose.model("Campground", campgroundSchema);