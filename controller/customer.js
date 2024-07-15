const express = require("express");
const mssql = require("mssql");

// DB connection
const { getConnection } = require("../connection/connection");

// reading customers
const handleReadCustomers = async (req, res) => {
  try {
    const pool = await getConnection();

    const read_query = "SELECT * FROM Customers";
    const result = await pool.request().query(read_query);

    console.log(result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).json({ error: "Error executing SQL query" });
  }
};

// creating new customer table
const handleCreateCustomer = async (req, res) => {
  try {
    const pool = await getConnection();

    const create_table_query = `
          CREATE TABLE Customers (
            CustomerID INT IDENTITY(1,1) PRIMARY KEY,
            CustomerName NVARCHAR(255) NOT NULL,
            ContactName NVARCHAR(255),
            City NVARCHAR(255)
          );
        `;

    await pool.request().query(create_table_query);

    res.json({ message: "Table created successfully" });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).json({ error: "Error creating table" });
  }
};

// creating new customer
const handleInsertCustomer = async (req, res) => {
  try {
    const pool = await getConnection();

    const { CustomerName, ContactName, City } = req.body;

    const query = `
          INSERT INTO Customers (CustomerName, ContactName, City)
          VALUES (@CustomerName, @ContactName, @City);
        `;

    const result = await pool
      .request()
      .input("CustomerName", mssql.NVarChar(255), CustomerName)
      .input("ContactName", mssql.NVarChar(255), ContactName)
      .input("City", mssql.NVarChar(255), City)
      .query(query);

    console.log("Rows affected:", result.rowsAffected);

    res.json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error("SQL error", err);
    res
      .status(500)
      .json({ error: "Error inserting data into Customers table" });
  }
};

// deleting new customer table
const handleDeleteCustomer = async (req, res) => {
  try {
    const pool = await getConnection();
    const { id } = req.params;

    const query = `
          DELETE FROM Customers
          WHERE CustomerID = @id;
        `;

    const result = await pool.request().input("id", mssql.Int, id).query(query);

    console.log("Rows affected:", result.rowsAffected);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: `Customer ${id} deleted successfully` });
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).json({ error: "Error deleting customer" });
  }
};

module.exports = {
  handleReadCustomers,
  handleCreateCustomer,
  handleInsertCustomer,
  handleDeleteCustomer,
};
