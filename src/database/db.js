const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const sharp = require('sharp');


const uri =
  "mongodb://finstepAdmin:finstep123@ac-gcvl6tk-shard-00-00.xejailu.mongodb.net:27017,ac-gcvl6tk-shard-00-01.xejailu.mongodb.net:27017,ac-gcvl6tk-shard-00-02.xejailu.mongodb.net:27017/finstep?ssl=true&replicaSet=atlas-yixs66-shard-0&authSource=admin&retryWrites=true&w=majority";


// mongoose
//   .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((client) => {
//     console.log("connected to db")
  
//   });

  //easy way to access database

  const client = new MongoClient(uri,  { useUnifiedTopology: true, useNewUrlParser: true , connectTimeoutMS: 30000 });

 


  //get data from database
  async function getDataFromCollection(collectionName) {
    try {
      const db = client.db('finstep');
      const collection = db.collection(collectionName);
      const docs = await collection.find({}).toArray();

      return docs;
    } catch (error) {
      console.error(error);
      return null;
    }
  }  




  var taskSchema = new mongoose.Schema({
      amount: String,
      name: String,
      imageUri:Buffer,
      date:String,
      status:String,
      studentId:String
  });
var tasks=mongoose.model('tasks',taskSchema)

  //function after completeing the tasks
  //add new feild in exisisting collection
  async function addNewFieldToCollection( collectionName, fieldValue,id) {
    try { 
     

      const db = client.db('finstep');
      const collection = db.collection(collectionName)
    const image =fieldValue


      if(image==='this is scam img'){
        const result2 = await collection.findOneAndUpdate( {_id:new ObjectId(id)},  { $set:{ status: 'completed' }} );
return result2       
      }else{
     
const maxWidth = 500;
const maxHeight = 500;
const quality = 80;

// Create a buffer from the base64 image
const buffer = Buffer.from(image, 'base64');

if (buffer.length === 0) {
  console.log('Image buffer is empty');
} else {

  sharp(buffer)
  .resize(maxWidth, maxHeight)
  .jpeg({ quality: quality })
  .toBuffer()
  .then( async(compressedImage) => {
console.log(compressedImage,'img');
    const result = await collection.findOneAndUpdate( {_id:new ObjectId(id)},  { $set:{ imageUri:compressedImage  }})
  
    const result2 = await collection.findOneAndUpdate( {_id:new ObjectId(id)},  { $set:{ status: 'completed' }} );
  console.log(result2);
     return result2
  })
  .catch((error) => console.error(error))
}
    }

    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  //add new feild in exisisting collection
  async function approveTask(id) {
    try {
      
      const db = client.db('finstep');
      const collection = db.collection('tasks');
      
      const result= await collection.findOneAndUpdate( {_id:new ObjectId(id)},  { $set:{ status: 'approved' }});
      const result2= await collection.updateOne( {_id:new ObjectId(id)},  { $unset:{ imageUri: '' }});
     
    return result
    } catch (error) {
      console.log(error);
    }
  }
 //common function used in databases. used to find data with Id 
async function findDocumentsByFieldValue(collectionName, fieldName, fieldValue) {
    try {
      const db = client.db('finstep');
      const collection = db.collection(collectionName);
      const query = { [fieldName]: fieldValue };
     
      const result = await collection.find(query).toArray(function(err, documents) {
        if (err) {
          console.error(err);
          return;
        }
      })
     
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }


  async function findUser(fieldValue){
    try {
    
      const db = client.db('finstep');
      const collection = db.collection('Login');
      const docs = await collection.find({}).toArray()
      const query = { userId: fieldValue };
      console.log(query);
console.log(docs);
      const result = await collection.findOne({ userId: fieldValue })
    
const filteredData = docs.filter(obj => obj.userId === 134567);
console.log(filteredData);
      return filteredData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

 
//to insert many docs in collection
  async function insertDocuments(collectionName, documents) {
    try {
      const db = client.db('finstep');
      const collection = db.collection(collectionName);
      const result = await collection.insertMany(documents);
      console.log(`Inserted ${result.insertedCount} documents into the ${collectionName} collection`);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function insertDocument(collectionName, document) {
    try {
      const db = client.db('finstep');
      const collection = db.collection(collectionName);
      const result = await collection.insertOne(document);
      console.log(`Inserted ${result.insertedCount} documents into the ${collectionName} collection`);
      console.log(result)
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
 

  //to delete by id
  async function deleteDocumentById(collectionName, id) {
    try {
      const db = client.db('finstep');
      const collection = db.collection(collectionName);
      const result = await collection.deleteOne({ _id: ObjectId(id) });
      console.log(`Deleted ${result.deletedCount} documents from the ${collectionName} collection`);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      await client.close();
    }
  }


  //to delete by id
  async function loginUser(data) {
    try {
      
        const { name, password } = data;
      console.log(name,password);
      const db = client.db('finstep');
      const collection = db.collection('Login');
      
 // Find a user with the given username and password
const user=await collection.findOne({name})
console.log(user);
if (!user) {
  return null
}
if (password===user.password){
 console.log('password matched');
 return user;
  
}

    } catch (error) {
      console.error(error);
      return null;
    } finally {
      
    }
  }


  module.exports = { loginUser, getDataFromCollection,findDocumentsByFieldValue,insertDocument,addNewFieldToCollection,tasks, approveTask, findUser};
