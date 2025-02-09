// App Create
const express = require("express");
const app = express();

// Find PORT Number
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Add Middleware
app.use(express.json());
// Express Fileuplaod - npm install express-fileupload
const fileupload = require("express-fileupload");
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connect with DB
const db = require("./config/database");
db.connect();

// Connect with cloud
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// Mount API Route
const Upload = require("./routes/FileUplaod");
app.use("/api/v1/upload", Upload);

// Activate Server
app.listen(PORT, () => {
  console.log(`App is Running at ${PORT}`);
});
