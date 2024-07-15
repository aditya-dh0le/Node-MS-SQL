// libraries
const express = require("express");

// importing routes
const customersRoute = require("./routes/customers");

const app = express();
const port = 3000;

// middlewares
app.use(express.json());

// routing to custom routes
app.use("/customers", customersRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
