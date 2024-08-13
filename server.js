const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Function to create an endpoint for a JSON file
const createEndpoint = (fileName) => {
  const endpoint = `/${path.basename(fileName, '.json')}`;
  const jsonFilePath = path.join(DATA_DIR, fileName);

  app.get(endpoint, (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading ${jsonFilePath}:`, err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    });
  });

  console.log(`Endpoint created: ${endpoint}`);
};

// Read the directory and create endpoints
fs.readdir(DATA_DIR, (err, files) => {
  if (err) {
    console.error('Error reading data directory:', err);
    process.exit(1);
  }

  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      createEndpoint(file);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Files should be placed in ${path.join(__dirname, 'data')}`);
});