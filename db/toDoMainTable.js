var mongoose=require('mongoose');
var toDoSchema=mongoose.Schema;



module.exports=mongoose.model('toDoTable',new toDoSchema({
	title    :String,
	deadline :String

},{
    timestamps: true
}));