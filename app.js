var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var apiRouter=require('./routes/routes');
var authRouter=require('./routes/authentication');
var port=3000;

var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/todo');



//console.dir(toDo);

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/todo',apiRouter);
app.use('/auth',authRouter);



var server=app.listen(port,function(){
	console.log(' app is listening to   ' +port);
});