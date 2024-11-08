// server/server.js
const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const port = 3000;
const grades = require('./routes/gradesRoute');
const courses = require('./routes/coursesRoute');
const academic = require('./routes/academicRoute');

// Use CORS middleware
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount router
app.use('/grade', grades);
app.use('/courses', courses);
app.use('/academic', academic);

// Home route
app.get('/', (req, res) => {
  res.send("Home");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
