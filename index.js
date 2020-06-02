const express = require('express');
const cors = require('cors');

// Route imports
const apiRoutes = require('./apiRoutes');

// Initialize server
const server = express();
const port = 5000;
server.use(express.json());
server.use(cors());

// Routes
server.use('/api', apiRoutes);

// Deploy
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
});