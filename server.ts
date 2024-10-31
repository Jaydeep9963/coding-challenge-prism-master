import "dotenv/config";
import { Client } from "pg";
import express from "express";
import waitOn from "wait-on";
import onExit from "signal-exit";
import cors from "cors";

// Add your routes here
const setupApp = (client: Client): express.Application => {
  const app: express.Application = express();

  app.use(cors());

  app.use(express.json());

  app.post("/margins-padding", async (req, res) => {
    try {
      // Extract data from the request body
      const { id, value, unit } = req.body; // Expecting id, value, and unit in the request body
  
      // Update the entry in the margins_padding table
      const queryText = `
        UPDATE margins_padding 
        SET value = $1, unit = $2 
        WHERE id = $3 
        RETURNING *;
      `;
      const values = [value, unit, id];
      const { rows } = await client.query(queryText, values);
  
      // Check if the row was updated
      if (rows.length === 0) {
        return res.status(404).json({ error: "Entry not found." });
      }
  
      // Return the updated row as a response
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error updating data in margins_padding:", error);
      res.status(500).json({ error: "An error occurred while updating data." });
    }
  });
  

  app.get("/margins-padding", async (_req, res) => {
    try {
      // Query to fetch all data from the margins_padding table
      const { rows } = await client.query("SELECT * FROM margins_padding");
  
      // Send the data as a JSON response
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching data from margins_padding:", error);
      res.status(500).json({ error: "An error occurred while retrieving data." });
    }
  });
  
  return app;
};

// Waits for the database to start and connects
const connect = async (): Promise<Client> => {
  console.log("Connecting");
  const resource = `tcp:${process.env.PGHOST}:${process.env.PGPORT}`;
  console.log(`Waiting for ${resource}`);
  await waitOn({ resources: [resource] });
  console.log("Initializing client");
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT!),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  });
  await client.connect();
  console.log("Connected to database");

  // Ensure the client disconnects on exit
  onExit(async () => {
    console.log("onExit: closing client");
    await client.end();
  });

  return client;
};

const main = async () => {
  const client = await connect();
  const app = setupApp(client);
  const port = parseInt(process.env.SERVER_PORT!);
  app.listen(port, () => {
    console.log(
      `Draftbit Coding Challenge is running at http://localhost:${port}/`
    );
  });
};

main();
