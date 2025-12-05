const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

app.use(express.json())

app.listen(3000, () => {
    console.log("Server is running on port 3000!")
})

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDb!"))
.catch((err)=> {
    console.log(err)
})

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

