var mongoose = require('mongoose');

var userSchema=mongoose.Schema;


module.exports=mongoose.model('user',new userSchema({
	userName      :String,
	password	  :String

},
{
    timestamps: true
}));

