const db=require('./db')

const {findDocumentsByFieldValue}=require('./db')


async function getAllstudentFund(id){    
    return  findDocumentsByFieldValue('studentFund', 'studentId', id);
    }
  

module.exports={
 getAllstudentFund,

}