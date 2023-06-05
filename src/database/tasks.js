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
db.addNewFieldToCollection('finstep','tasks',task,id)
}
async function taskApproval(id){
db.approveTask(id)
}

module.exports = {
  getAlltask,
  createTask,
  uploadImage,
  taskApproval
};
