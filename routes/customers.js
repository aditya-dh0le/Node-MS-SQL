const express = require("express");
const mssql = require("mssql");
const router = express.Router();

// importing controllers
const {
  handleReadCustomers,
  handleCreateCustomer,
  handleInsertCustomer,
  handleDeleteCustomer,
} = require("../controller/customer");

// READ
router.get("/", handleReadCustomers);

// CREATE
router.get("/create-table", handleCreateCustomer);

// INSERT / UPDATE
router.post("/insert", handleInsertCustomer);

// DELETE
router.delete("/delete/:id", handleDeleteCustomer);

module.exports = router;
