var express=require('express');

var router=express.Router();


var toDo=require('../db/toDoMainTable.js');

var jwt    = require('jsonwebtoken')

router.route('/')
	

	// Create New Record
	.post(function(req,res){

			authenticate(req,res,authenticateCallback);
			function authenticateCallback(){
				if (!req.body){
					res.json({status:'empty body'});
				}
				var title = '';
				var deadline = '';

				if (req.body.title)
					title = req.body.title;
				if (req.body.deadline)
					deadline = req.body.deadline;

				//  Create New Record
				var createToDo = new toDo();

				// Initialize  Record fields
				createToDo.title = title;
				createToDo.deadline = deadline;
				//  Save   new Value  to DataBase
				createToDo.save(function afterSaveFunction(err,saved){
					if (!err){					
						res.json({status:'ok'});
					}						
					res.json({status:'server error'});						
				})


				
			}
	})

	//   SELECT   All Records from DB  
	//   No req.parameter or req.body  is needed
	.get(function(req,res){		
		toDo.find({},getAllCallback);

		function getAllCallback(err,result){
			if (err){
				res.json({status:'server error'});
			}
			// If there is no error return  result to client
			res.json(result);
		}
	});


//  
router.route('/:id')

    //   GET  Record  using provided ID  in req.params
    //   If ID is not provided INVALID URL is sent to client
	.get(function(req,res){
		if (!req.params.id){
			res.json({status:'invalid URL'})
		}
		toDo.findOne({_id:req.params.id},toDoFindOneCallback);
		//  Callback function
		function toDoFindOneCallback(err,result){
			if (err){
				res.json({status:'Error'});
			}
			res.json(result);				
		}
		
	})

	//  Update record using re.params.id
	//  Title and deadline  MUST be provided in  req.body
	//  only provided fields are updated
	.put(function updateRecors(req,res){

		authenticate(req,res,authenticateCallback);
		
		function authenticateCallback(){
			if (!req.params.id){
				res.json({status:'invalid URL'});
			}
			toDo.findOne({_id:req.params.id},toDoFindOneCallback);	
			//  Callback Function
			function toDoFindOneCallback(err,toUpdate){
						if (err){
							res.json({status:'error finding records'});
						}
						var title = null;
						var deadline = null;
						if (req.body.title){
							title = req.body.title;
						}else{
							title = toUpdate.title;
						}						
						//  Check if values  were provided  in  request
						if (req.body.deadline){
							deadline = req.body.deadline;
						}else{
							deadline = toUpdate.deadline;
						}
						// Update  found value
						toUpdate.title = title;
						toUpdate.deadline = deadline;
						toUpdate.save(function saveUpdatedValue(saveErr,result){
								if (saveErr){
									res.json({status:'error saving'});
								}
								res.json({status:'OK'});
							});						
				}	
		}		
	})

	//  Delete record  using req.body.id  parameter
	//  only 1 record is deleted per request
	.delete(function deleteRecord(req,res){

		authenticate(req,res,authenticateCallback);

		function authenticateCallback(){
			if (!req.params.id){
				res.json({status:'invalid URL'});
			}

			toDo.remove({_id:req.params.id},removeCallback)

			function removeCallback(err){
					if (err){
						res.json({status:'error removing record'});
					}
					res.json({status:'success'});
				}			
		}
		
	});	


//   middlware function  tor authentication
function authenticate(req,res,callback){
	// initialize Token  from   request
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
   
   // check token if nullable
	if (!token){
		res.json({status:'no token'});
	}

	jwt.verify(token, 'secret', verifyCallback);

  	//If verification succeds then  invoke callback,
  	//else  return  status with error
 	function verifyCallback(err, decoded) {
  		if (err){
  			res.json({status:'error while decoding'});
  		}  		  		
  		callback();  		
  	}	
}



module.exports = router;