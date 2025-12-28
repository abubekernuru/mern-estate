const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const userRoute = require('./routes/user.route.js');
const authRoute = require('./routes/auth.route.js');
const listingRoute = require('./routes/listing.route.js');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDb!"))
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/listing', listingRoute);

// Serve static files
__dirname = path.resolve();

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/dist/index.html'));
  });
}

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});