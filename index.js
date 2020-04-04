const express = require('express');
const cors = require('cors');
const server = express();
const port = 5000;

// Initialize server
server.use(express.json());
server.use(cors());

// Deploy
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
});