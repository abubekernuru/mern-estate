const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const userRoute = require('./routes/user.route.js');
const authRoute = require('./routes/auth.route.js');
const listingRoute = require('./routes/listing.route.js');
const cookieParser = require('cookie-parser');
const path = require('path');


app.use(express.json())
app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running on port 3000!")
})

const __dirname = path.resolve();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDb!"))
.catch((err)=> {
    console.log(err)
})

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/listing', listingRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => { {
    res.sendFile(path.join(__dirname, '/client/dist/index.html'));
}});

app.use((err, req, res, next)=> {
    const error = new Error();
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal serval error!";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})
