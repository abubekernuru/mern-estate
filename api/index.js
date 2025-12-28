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
  
  app.get(/.*/, (req, res) => {
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




// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const cookieParser = require('cookie-parser');
// const path = require('path');
// const fs = require('fs');

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB!"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Import routes
// const userRoute = require('./routes/user.route.js');
// const authRoute = require('./routes/auth.route.js');
// const listingRoute = require('./routes/listing.route.js');

// // API routes
// app.use('/api/user', userRoute);
// app.use('/api/auth', authRoute);
// app.use('/api/listing', listingRoute);

// // IMPORTANT: Get the correct path to client/dist
// // process.cwd() returns the root project directory
// const rootDir = process.cwd();
// const clientDistPath = path.join(rootDir, 'client', 'dist');

// console.log('Root directory:', rootDir);
// console.log('Client dist path:', clientDistPath);

// // Check if client/dist exists
// if (fs.existsSync(clientDistPath)) {
//   console.log('✅ Client dist folder FOUND!');
//   console.log('Files in client/dist:', fs.readdirSync(clientDistPath));
  
//   // Serve static files
//   app.use(express.static(clientDistPath));
  
//   // Handle SPA routing
//   app.get(/.*/, (req, res, next) => {
//     if (!req.path.startsWith('/api/')) {
//       res.sendFile(path.join(clientDistPath, 'index.html'));
//     } else {
//       next();
//     }
//   });
// } else {
//   console.log('❌ Client dist folder NOT found!');
//   console.log('Current directory contents:', fs.readdirSync(rootDir));
  
//   // Fallback response
//   app.get('/', (req, res) => {
//     res.send(`
//       <html>
//         <body style="font-family: Arial, sans-serif; padding: 20px;">
//           <h1>Server is running ✅</h1>
//           <p><strong>But React build files are missing.</strong></p>
//           <p>Expected at: ${clientDistPath}</p>
//           <p>Root directory: ${rootDir}</p>
//           <p>Current files in root:</p>
//           <ul>
//             ${fs.readdirSync(rootDir).map(file => `<li>${file}</li>`).join('')}
//           </ul>
//         </body>
//       </html>
//     `);
//   });
// }

// // Error handling middleware
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal server error!";
//   console.error('Error:', err);
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