import express from 'express';
import path from 'path';
import https from 'https'
import fs from 'fs'
import { waypoint_collection, final_path} from "./src/shortest_path.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = process.env.PORT || 443; // Default HTTPS port

// Parse incoming JSON data
app.use(express.json());

// Serve index.html
app.use(express.static(path.join(__dirname, 'src')));

const options = {
  key: fs.readFileSync(path.join(__dirname, 'misc', 'key.pem')),   // Path to your private key
  cert: fs.readFileSync(path.join(__dirname, 'misc', 'cert.pem')), // Path to your certificate
  passphrase: '5342', // needed to decrypt...
};

const server = https.createServer(options, app);

server.listen(port, '192.168.2.126', () => {    //can add optional parameter for IP address.  now I need sudo
  console.log(`Server is running on port ${port}`);
});



app.post('/shortest_path', (req, res) => {
  const dataFromClient = req.body.message;
  console.log('Data received from client:', dataFromClient);

  // Process the data and generate final_path

  res.json(final_path); // Respond with the result
});

