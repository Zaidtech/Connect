var mongoose = require('mongoose');
 
// var imageSchema = new mongoose.Schema({
//     // corresponding to that particular user!!
//     img:
//     {
//         data: Buffer,
//         contentType: String
//     }
    
// });

var imageSchema = new mongoose.Schema({
    img: String
});

//Image is a model which has a schema imageSchema
 
module.exports = new mongoose.model('Image', imageSchema);