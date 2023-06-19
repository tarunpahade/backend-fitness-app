const express = require('express');
const router = express.Router();
const { getAllTransaction } = require('../database/transaction');


router.get('/:studentId',async (req, res) => {
 const pro= await getAllTransaction(req.params.studentId)     
 
 res.send({status:'Ok', data:pro})
       })
       
router.get('/analytics/:studentId',async (req, res) => {
      console.log('hii',req.params.studentId);
      const transactions= await getAllTransaction(req.params.studentId)     
  if(transactions.length===0){
    return(
    'No Data Collected'
    )
    
  }
  const Income = transactions.filter((x) => x.credit === true);
  const Expense = transactions.filter((x) => x.credit === false);

function getUnique(Income) {

  const result = {};

for (const item of Income) {
  const { note, amount } = item;
  result[note] = (result[note] || 0) + amount;
}



  const uniqueNotes = Object.keys(result);
  
  
  const mergedObjects = uniqueNotes.map(note => {
  
    const matchingObjects = Income.filter(item => item.note === note);
    
    let mergedAmount = 0;
    for (const obj of matchingObjects) {
      const amount = parseInt(obj.amount);
      if (!isNaN(amount)) {
        mergedAmount += amount;
      }
    }


   // const mergedAmount = matchingObjects.reduce((sum, obj) => sum + parseInt(obj.amount.substring(1)), 0);
  
    
   
    return { note, amount: `${mergedAmount}`, userName: matchingObjects[0].userName };
  });
return mergedObjects;
}

const mergedObjects=getUnique(Income)
  const mergedObjects2=getUnique(Expense)


//finds out a monthly income
const uniquemonth=[]
const totalAmt=[]
function getUniqueMonth(Income) {
  
  const result = {};

for (const item of Income) {
  const { month, amount } = item;
  result[month] = (result[month] || 0) + amount;
}



  
  const uniqueNotes = Object.keys(result);

uniqueNotes.map(month => {
  
    const matchingObjects = Income.filter(item => item.month === month);
    let mergedAmount = 0;
    for (const obj of matchingObjects) {
      const amount = parseInt(obj.amount);
      if (!isNaN(amount)) {
        mergedAmount += amount;
      }
    }
    totalAmt.push(mergedAmount)

//    const mergedAmount = matchingObjects.reduce((sum, obj) => sum + parseInt(obj.amount.substring(1)), 0);
uniquemonth.push(month)

})



}
getUniqueMonth(Income)

const uniquemonth2=[]
const totalAmt2=[]


function getUniqueMonthExp(Income) {
  const result = {};

for (const item of Income) {
  const { month, amount } = item;
  result[month] = (result[month] || 0) + amount;
}

 
  
  const uniqueNotes = Object.keys(result);
  uniqueNotes.map((month) => {
    const matchingObjects = Income.filter(item => item.month === month);
    let mergedAmount = 0;
    for (const obj of matchingObjects) {
      const amount = parseInt(obj.amount);
      if (!isNaN(amount)) {
        mergedAmount += amount;
      }
    }
    totalAmt2.push(mergedAmount)
    uniquemonth2.push(month)
  
    return { month, amount: `${mergedAmount}` };
  })
}
getUniqueMonthExp(Expense)
//for starting piechart
const IncSum= totalAmt
    .map( function(elt){ // assure the value can be converted into an integer
      return /^\d+$/.test(elt) ? parseInt(elt) : 0; 
    })
    .reduce( function(a,b){ // sum all resulting numbers
      return a+b
    })
    
const ExpSum= totalAmt2
.map( function(elt){ // assure the value can be converted into an integer
  return /^\d+$/.test(elt) ? parseInt(elt) : 0; 
})
.reduce( function(a,b){ // sum all resulting numbers
  return a+b
})
const output=[{IncSum:IncSum,ExpSum:ExpSum,uniquemonth:uniquemonth,uniquemonth2:uniquemonth2,totalAmt:totalAmt,totalAmt2:totalAmt2}]
console.log(output);
      res.send({status:'Ok', data:output})
            })

 
       
module.exports=router