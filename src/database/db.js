const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://tarunpahade:L3Tq6SiAPEjbHcYl@cluster0.r0pseib.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("FitnessApp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);
//get data from database
async function getDataFromCollection(collectionName) {
  try {
    await client.connect();
    const db = client.db("FitnessApp");
    console.log("This is a collection", collectionName);
    const collection = db.collection(collectionName);
    const docs = await collection.find({}).toArray();
    console.log(docs);
    return docs;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//common function used in databases. used to find data with Id
async function findDocumentsByFieldValue(
  collectionName,
  fieldName,
  fieldValue
) {
  try {
    await client.connect();
    const db = client.db("FitnessApp");
    const collection = db.collection(collectionName);
    const query = { [fieldName]: fieldValue };
console.log(query);
    const result = await collection
      .find(query)
      .toArray(function (err, documents) {
        if (err) {
          console.error(err);
          return;
        }
      });
    console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updateDocumentById(collectionName, documentId, newDocumentData) {
  try {
    await client.connect();
    const db = client.db('FitnessApp');
    const collection = db.collection(collectionName);

    const objectId = new ObjectId(documentId);
    const query = { _id: objectId };

    // Define the update operation to replace the entire document with new data
    const updateOperation = {
      $set: { "workout": newDocumentData }, // Use $set to update the entire document
    };

    // Find the document by _id and update it
    const result = await collection.findOneAndUpdate(query, updateOperation, {
      returnOriginal: false, // Return the updated document, not the original
    });

    return result; // Return the updated document
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // Close the MongoDB client when done
    await client.close();
  }
}





async function findUser(fieldValue) {
  try {
    const db = client.db("FitnessApp");
    const collection = db.collection("Login");
    const docs = await collection.find({}).toArray();

    const filteredData = docs.filter(
      (obj) => obj.userId === JSON.parse(fieldValue)
    );
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
    const db = client.db("FitnessApp");
    const collection = db.collection(collectionName);
    const result = await collection.insertMany(documents);
    console.log(
      `Inserted ${result.insertedCount} documents into the ${collectionName} collection`
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//for inserting document
async function insertDocument(collectionName, document) {
  try {
    await client.connect();
    const db = client.db("FitnessApp");
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(document);
    console.log(
      `Inserted ${result.insertedCount} documents into the ${collectionName} collection`
    );

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//to delete by id
async function deleteDocumentById(collectionName, id) {
  try {
    const db = client.db("FitnessApp");
    const collection = db.collection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log(
      `Deleted ${result.deletedCount} documents from the ${collectionName} collection`
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//For login
async function loginUser(data) {
  try {
    const { email } = data;
    const db = client.db("FitnessApp");
    const collection = db.collection("Login");
    console.log("hello");

    // Find a user with the given username and password
    const user = await collection.findOne({ email });
    console.log(user);
    if (!user) {
      return "New User";
    }
    if (user) {
      console.log("User Found");
      return user;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  deleteDocumentById,
  loginUser,
  getDataFromCollection,
  findDocumentsByFieldValue,
  insertDocument,
  insertDocuments,
  run,
  findUser,
  updateDocumentById
};
