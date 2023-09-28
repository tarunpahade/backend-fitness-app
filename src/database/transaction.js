const db = require("./db");
const { getDataFromCollection } = require("./db");
const { findDocumentsByFieldValue } = require("./db");

async function getAllTransaction(id) {
  console.log(id);
  return findDocumentsByFieldValue("transactions", "studentId", id);
}

module.exports = {
  getAllTransaction,
};
