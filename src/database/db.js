const { MongoClient, ObjectId, Int32 } = require("mongodb");
const sharp = require("sharp");

const uri =
  "mongodb://finstepAdmin:finstep123@ac-gcvl6tk-shard-00-00.xejailu.mongodb.net:27017,ac-gcvl6tk-shard-00-01.xejailu.mongodb.net:27017,ac-gcvl6tk-shard-00-02.xejailu.mongodb.net:27017/finstep?ssl=true&replicaSet=atlas-yixs66-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  connectTimeoutMS: 30000,
});

//get data from database
async function getDataFromCollection(collectionName) {
  try {
    const db = client.db("finstep");
    const collection = db.collection(collectionName);
    const docs = await collection.find({}).toArray();

    return docs;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//add new feild in exisisting collection child uploads task
async function addNewFieldToCollection(collectionName, fieldValue, id) {
  try {
    const db = client.db("finstep");
    const collection = db.collection(collectionName);
    const image = fieldValue;

    console.log(id, fieldValue, "yhis is id and feild value");
    if (typeof image === "string") {
      const result2 = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: "completed" } }
      );

      return result2;
    } else {
      const maxWidth = 500;
      const maxHeight = 500;
      const quality = 80;

      // Create a buffer from the base64 image
      const buffer = Buffer.from(image, "base64");

      if (buffer.length === 0) {
        console.log("Image buffer is empty");
      } else {
        sharp(buffer)
          .resize(maxWidth, maxHeight)
          .jpeg({ quality: quality })
          .toBuffer()
          .then(async (compressedImage) => {
            const result = await collection.findOneAndUpdate(
              { _id: new ObjectId(id) },
              { $set: { imageUri: compressedImage } }
            );

            const result2 = await collection.findOneAndUpdate(
              { _id: new ObjectId(id) },
              { $set: { status: "completed" } }
            );

            return result2;
          })
          .catch((error) => console.error(error));
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function redoTask(id) {
  try {
    3;
    const db = client.db("finstep");
    const collection = db.collection("tasks");

    console.log(id, "yhis is id and feild value");

    const result2 = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status: "pending" } }
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

//When parent approves the task
async function approveTask(id, studentId) {
  try {
    console.log(studentId);
    const db = client.db("finstep");
    const collection = db.collection("tasks");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status: "approved" } }
    );
    const result2 = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $unset: { imageUri: "" } }
    );
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}
//common function used in databases. used to find data with Id
async function findDocumentsByFieldValue(
  collectionName,
  fieldName,
  fieldValue
) {
  try {
    const db = client.db("finstep");
    const collection = db.collection(collectionName);
    const query = { [fieldName]: fieldValue };

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

//finds balance
async function findUser(fieldValue) {
  try {
    const db = client.db("finstep");
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
    const db = client.db("finstep");
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
    const db = client.db("finstep");
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
    const db = client.db("finstep");
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
    const { phone_number } = data;
    const db = client.db("finstep");
    const collection = db.collection("Login");
console.log('hello');

    // Find a user with the given username and password
    const user = await collection.findOne({ phone_number });
    console.log(user);
    if (!user) {
      return 'New User';
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

//parent sends money to child for the task done
async function sendMoneyandRemoveTask(data) {
  try {
    console.log("start");
    const db = client.db("finstep");
    const tasks = db.collection("tasks");
    const login = db.collection("Login");

    const { taskId, amount, studentId, parentId, taskName, date } = data;
    console.log(data, "this is dat");

    const parent = await login.findOne({ userId: parentId });
    const student = await login.findOne({ userId: JSON.parse(studentId) });

    const parentBalance = parent.balance - JSON.parse(amount.substring(2));
    const studentBalance = student.balance + JSON.parse(amount.substring(2));

    parent.balance = parentBalance;
    student.balance = studentBalance;

    console.log(parentBalance, studentBalance);

    if (parentBalance < 0) {
      return "Zero Balance";
    } else {
      const result = await login.findOneAndUpdate(
        { userId: parentId },
        { $set: { balance: parentBalance } },
        { returnOriginal: false }
      );

      const result2 = await login.findOneAndUpdate(
        { userId: JSON.parse(studentId) },
        { $set: { balance: studentBalance } },
        { returnOriginal: false }
      );
      const currentDate = new Date();
      const month = currentDate.toLocaleString("default", { month: "short" });
      const currentDate2 = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });

      const transaction = {
        amount: JSON.parse(amount.substring(2)),
        credit: true,
        month: month,
        note: "tasks",
        studentId: studentId,
        transactionDate: currentDate2,
        userName: "Parent",
        userImage:
          "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      };
      const transactionCollection = db.collection("transactions");
      const result4 = await transactionCollection.insertOne(transaction);
      console.log(result4);
      const result3 = await tasks.deleteOne({ _id: new ObjectId(taskId) });
      const notifications = {
        userId: JSON.parse(data.studentId),
        amount: data.amount,
        childName: student.name,
        name: taskName,
        type: "Approved",
      };
      const inserrtNotification = await insertDocument(
        "Notifications",
        notifications
      );
      console.log(inserrtNotification, "this is inserrtNotification");

      return result;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

//parent sends money to child
async function parentToChild(data) {
  try {
    console.log("start");
    const db = client.db("finstep");
    const login = db.collection("Login");

    const { amount, studentId, parentId } = data;
    console.log(data, "this is dat");

    const parent = await login.findOne({ userId: parentId });
    const student = await login.findOne({ userId: studentId });

    const parentBalance = parent.balance - JSON.parse(amount);
    const studentBalance = student.balance + JSON.parse(amount);

    parent.balance = parentBalance;
    student.balance = studentBalance;

    console.log(parentBalance, studentBalance);

    if (parentBalance < 0) {
      return "Zero Balance";
    } else {
      const result = await login.findOneAndUpdate(
        { userId: parentId },
        { $set: { balance: parentBalance } },
        { returnOriginal: false }
      );

      const result2 = await login.findOneAndUpdate(
        { userId: JSON.parse(studentId) },
        { $set: { balance: studentBalance } },
        { returnOriginal: false }
      );
      const currentDate = new Date();
      const month = currentDate.toLocaleString("default", { month: "short" });
      const currentDate2 = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });

      const transaction = {
        amount: JSON.parse(amount),
        credit: true,
        month: month,
        note: "Parent",
        studentId: JSON.stringify(studentId),
        transactionDate: currentDate2,
        userName: "Parent",
        userImage:
          "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      };
      const transactionCollection = db.collection("transactions");
      const result4 = await transactionCollection.insertOne(transaction);

      const notifications = {
        userId: JSON.parse(studentId),
        amount: amount,
        childName: student.name,
        name: parent,
        type: "Money Sent By Parent",
      };
      const inserrtNotification = await insertDocument(
        "Notifications",
        notifications
      );
      console.log(inserrtNotification, "this is inserrtNotification");
      console.log(result4, result2, result);

      return result;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

//when child makes the transaction
async function sendMoneyAndAddTransaction(data) {
  try {
    console.log("starting to send money");
    const db = client.db("finstep");
    const login = db.collection("Login");

    const { phone, studentId, amount, note, to } = data;

    const student = await login.findOne({ userId: studentId });
    console.log(student, "this is student");
    const studentBalance = student.balance - JSON.parse(amount);

    const result = await login.findOneAndUpdate(
      { userId: JSON.parse(studentId) },
      { $set: { balance: studentBalance } },
      { returnOriginal: false }
    );
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const currentDate2 = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
    const transaction = {
      amount: JSON.parse(amount),
      credit: false,
      month: month,
      note: note,
      studentId: JSON.stringify(studentId),
      transactionDate: currentDate2,
      userName: to,
      userImage:
        "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
      phoneNumber: phone,
    };
    const transactionCollection = db.collection("transactions");
    const result4 = await transactionCollection.insertOne(transaction);
    console.log(result4);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//to add child
async function addChild(document) {
  try {
    const db = client.db("finstep");
    const collection = db.collection("Login");
    const result = await collection.insertOne(document);
    console.log(
      `Inserted ${result.insertedCount} documents into the  collection`
    );
    const { parentId, name, phone_number, userId } = document;

    const parent = await collection.findOne({ userId: parentId });
    console.log(parent.chlidren);
    const newChild = { name, phoneNumber: phone_number, userId };

    const result2 = await collection.updateOne(
      { userId: parentId },
      { $push: { children: newChild } }
    );

    if (result2.modifiedCount === 1) {
      console.log("Child added successfully");
    } else {
      console.log("Failed to add child");
    }

    console.log(result, result2);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function addMoneyToThePot({
  userId,
  potId,
  amount,
  from,
  fundName,
  studentId,
}) {
  try {
    const db = client.db("finstep");
    const parsedAmount = JSON.parse(amount);
    const login = db.collection("Login");
    const studentFund = db.collection("studentFund");
    const parentFund = db.collection("parentFund");
    console.log(userId,'amuser');
   const user= await login.findOne({userId:userId})
console.log(user,'userIam');
   const afterBalance=user.balance-parsedAmount
   console.log(afterBalance,'afterBalance');
    if(afterBalance<=0){
      console.log('yoyo');
      return "Insufficient Balance"
    } else if(afterBalance>0 ){

      const afterUpdate = await login.findOneAndUpdate(
        { userId: userId },
        { $inc: { balance: afterBalance} }
      );
      console.log(afterUpdate);
    
    if (from === "parent") {
    console.log('USER ID OF PARENT', userId);
    
      const pot = await parentFund.findOneAndUpdate(
        { _id: new ObjectId(potId) },
        { $inc: { savedAmount: parsedAmount } }
      );

      console.log( pot);
      const currentDate = new Date();
      const month = currentDate.toLocaleString("default", { month: "short" });
      const currentDate2 = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
      const transaction = {
        amount: JSON.parse(amount),
        credit: false,
        month: month,
        note: fundName,
        potId: potId,
        studentId: JSON.stringify(studentId),
        transactionDate: currentDate2,
        userName: "savings pot",
        userImage:
          "https://www.pngkit.com/png/full/423-4237366_piggy-bank-coin-piggy-bank-vector-png.png",
      };
      const transactionCollection = db.collection("transactions");
      const result4 = await transactionCollection.insertOne(transaction);
      console.log(result4);
      return result4;
    } else if (from === "student") {
    console.log('From student');
      const pot = await studentFund.findOneAndUpdate(
        { _id: new ObjectId(potId) },
        { $inc: { savedAmount: parsedAmount } }
      );

      console.log(student, pot);
      const currentDate = new Date();
      const month = currentDate.toLocaleString("default", { month: "short" });
      const currentDate2 = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
      const transaction = {
        amount: JSON.parse(amount),
        credit: false,
        month: month,
        note: fundName,
        potId: potId,
        studentId: JSON.stringify(studentId),
        transactionDate: currentDate2,
        userName: "Parent pot",
        userImage:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKDlUa5EPVm0bAs_GiK4XiOjFWSLvLWmhLLg&usqp=CAU",
      };
      const transactionCollection = db.collection("transactions");
      const result4 = await transactionCollection.insertOne(transaction);
      console.log(result4);
      return result4;
    }}
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  sendMoneyAndAddTransaction,
  deleteDocumentById,
  addChild,
  sendMoneyandRemoveTask,
  loginUser,
  getDataFromCollection,
  findDocumentsByFieldValue,
  insertDocument,
  addNewFieldToCollection,
  approveTask,
  findUser,
  parentToChild,
  redoTask,
  addMoneyToThePot,
};

//   var taskSchema = new mongoose.Schema({
//       amount: String,
//       name: String,
//       imageUri:Buffer,
//       date:String,
//       status:String,
//       studentId:String
//   });
// var tasks=mongoose.model('tasks',taskSchema)
// const loginSchema = new mongoose.Schema({
//   _id: mongoose.Types.ObjectId,
//   name: String,
//   panNumber: String,
//   balance: Number,
//   password: String,
//   expoPushToken: String,
//   is_parent: Boolean,
//   children: [
//     {
//       expoPushToken: String,
//       name: String,
//       phoneNumber: Number,
//       userId: Number
//     }
//   ],
//   userId: Number,
//   phone_number: Number,
//   date_of_birth: String,
//   current_class: Number,
//   parentId: Number
// });

// const Login = mongoose.model('Login', loginSchema);
//function after completeing the tasks}
