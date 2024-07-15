// connect.js
const mssql = require("mssql");
const config = require("./config");

const configData = {
  server: config.databaseHost,
  user: config.databaseUser,
  password: config.databasePassword,
  options: {
    trustServerCertificate: true,
    connectTimeout: 30000,
  },
};

const maxConnectionAttempts = 3;
let connectionAttempts = 0;

let connection; // To hold the connection object

function connectToDatabase() {
  mssql.connect(configData, function (err, con) {
    if (err) {
      console.log(
        `Connection attempt failed. Attempt ${
          connectionAttempts + 1
        }/${maxConnectionAttempts}`
      );
      connectionAttempts++;

      if (connectionAttempts < maxConnectionAttempts) {
        setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
      } else {
        console.log("Exceeded maximum connection attempts. Exiting.");
        process.exit(1); // Exit the process if max attempts exceeded
      }
    } else {
      console.log("Connection established for Database");
      console.log(configData);
      connection = con; // Save the connection object
    }
  });
}

// Start the initial connection attempt
connectToDatabase();

// Export the connection object for use in other modules
module.exports = {
  getConnection: () => connection,
};
