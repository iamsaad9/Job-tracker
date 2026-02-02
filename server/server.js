const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./App");

const dbconfig = require("./config/dbConfig");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
