const express = require("express")
const router = require('./routes/user.js')

const app = express();
app.use(router)

app.listen(8080, () => {
  console.log("Server running on port 8080");
})