const db = require("./db");
const { findDocumentsByFieldValue } = require("./db");


async function getAlltask(id) {
  return findDocumentsByFieldValue("tasks", "studentId", id);
}
async function createTask(task) {

  const result = await db.insertDocument("tasks", task);

  return result;
  };

async function uploadImage(task,id) {
 console.log(task);
  db.addNewFieldToCollection('tasks',task,id)
}
async function taskApproval(id,studentId){
db.approveTask(id)
}

module.exports = {
  getAlltask,
  createTask,
  uploadImage,
  taskApproval
};
