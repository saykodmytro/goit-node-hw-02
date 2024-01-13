require("dotenv").config();

require("./db");

const app = require("./app");

app.listen(8080, () => {
  console.log("Server running on port: 8080");
});
