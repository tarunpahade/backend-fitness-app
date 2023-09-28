const db=require('./db')

const {findDocumentsByFieldValue}=require('./db')
async function getAllparentFund(id){
    return findDocumentsByFieldValue ('parentFund', 'studentId', id);
    }
  

module.exports={
 getAllparentFund,

}