var express=require('express');

var user=require('../db/user');

var jwt    = require('jsonwebtoken')

var router=express.Router();

router.route('/')

	  //   REGISTER    user  with provided User Name and Password
	  //   If User Or Password is empty return Status With Error
	  //   If User exists in DB  Return Status with Error
	  //   else  create new user
      .put(function(req,res){

      		//get username and password    from request
      		var userName = req.body.userName;
      		var password = req.body.password;
      		// Check If user name and password are provided
      		//  If Not return  status  with error
      		if (!userName){
      			res.json({status:'userName is empty'});
      		}
      		if (!password){
      			res.json({status:'password is empty'});
      		}	
  			// Find user with user and password
      		user.findOne({userName:userName},userFindCallback)
      		
      		//  Callback Function For Find
      		function userFindCallback(err,result){      			

      			if (err){
      				res.json({status:'error'});
      			}
      			if (result){
      				res.json({status:'user exists'});
      			}

  				// If there is no error  and  there is no Record  to DB  then  create new user
  				newUser = new user();
  				newUser.userName = userName;
  				newUser.password = password;

  				//   Save new user Record
  				newUser.save(function afterSaveCallback(saveErr,result){
  					if (saveErr){
  						res.json({status:'could not save'});
  					}
  					res.json({status:'user saved'});
  				})      

      		}      

      })


      //    LOG IN  user
      //   If user with credentials  are  found in DB
      //   then  create token and send to client
      //   else send status message with error identification
	  .post(function(req,res){

	  		if (!req.body.userName){
	  			res.json({status:'user name empty'});
	  		}
	  		if (!req.body.password){
	  			res.json({status:'Password empty'});
	  		}
	  		user.findOne({userName:req.body.userName,password:req.body.password},userFindOneCallback);

	  		function userFindOneCallback (err,foundUser){
	  				if (err){
	  					res.json({status:'error occured'});
	  				}
					// iIf  user is found
					if (foundUser){
						//   Create  New Token  with secret
						var token = jwt.sign(foundUser,'secret');
						//  Send  the token   via JSON
						res.json({
							success:true,
							message:'token generated',
							token:token
						});

					}
					//  If user was not found
					res.json({status:'user not found'}); 
	  			}
	  });






module.exports = router;