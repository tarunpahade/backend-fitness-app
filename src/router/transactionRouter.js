const express = require('express');
const router = express.Router();
const { getAllTransaction } = require('../database/transaction');


router.get('/:studentId',async (req, res) => {
 const pro= await getAllTransaction(req.params.studentId)     
 
 res.send({status:'Ok', data:pro})
       })

       
 
       
module.exports=router