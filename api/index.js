// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const app = express();
// const userRoute = require('./routes/user.route.js');
// const authRoute = require('./routes/auth.route.js');
// const listingRoute = require('./routes/listing.route.js');
// const cookieParser = require('cookie-parser');
// const path = require('path');

// app.use(express.json());
// app.use(cookieParser());


// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDb!"))
//   .catch((err) => {
//     console.log(err);
//   });

// // Routes
// app.use('/api/user', userRoute);
// app.use('/api/auth', authRoute);
// app.use('/api/listing', listingRoute);

// // Serve static files
// __dirname = path.resolve();

// // Only serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/client/dist')));
  
//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.join(__dirname, '/client/dist/index.html'));
//   });
// }

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal server error!";
//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message
//   });
// });


// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}!`);
// });

// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import routes
const userRoute = require('./api/routes/user.route.js');
const authRoute = require('./api/routes/auth.route.js');
const listingRoute = require('./api/routes/listing.route.js');

// API routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/listing', listingRoute);

// Serve static files from client/dist
const clientDistPath = path.join(__dirname, 'client', 'dist');

// Check if production and client/dist exists
const isProduction = process.env.NODE_ENV === 'production';
const clientDistExists = fs.existsSync(clientDistPath);

console.log('Production mode:', isProduction);
console.log('Client dist path:', clientDistPath);
console.log('Client dist exists:', clientDistExists);

if (isProduction && clientDistExists) {
  console.log('Serving static files from:', clientDistPath);
  app.use(express.static(clientDistPath));
  
  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api/')) {
      const indexPath = path.join(clientDistPath, 'index.html');
      console.log('Serving index.html from:', indexPath);
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
} else if (isProduction) {
  console.warn('WARNING: Production mode but client/dist folder not found!');
  console.log('Current directory:', __dirname);
  console.log('Directory contents:', fs.readdirSync(__dirname));
  
  // Fallback for production
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <body>
          <h1>Server is running ✅</h1>
          <p>But React build files are missing.</p>
          <p>Check if build completed successfully.</p>
          <p>Client dist path expected at: ${clientDistPath}</p>
        </body>
      </html>
    `);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error!";
  console.error('Error:', err);
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});