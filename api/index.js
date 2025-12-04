const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000!")
})

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDb!"))
.catch((err)=> {
    console.log(err)
})