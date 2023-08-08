import express from 'express';
import path from 'path';
import { waypoint_collection, final_path} from "./src/shortest_path.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = process.env.PORT || 3000;

// Parse incoming JSON data
app.use(express.json());

// Serve index.html
app.use(express.static(path.join(__dirname, '.')));

app.post('/shortest_path', (req, res) => {
  const dataFromClient = req.body.message;
  console.log('Data received from client:', dataFromClient);

  // Process the data and generate final_path

  res.json(final_path); // Respond with the result
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
