import * as path from "path";
import * as fs from "fs-extra";

const main = path.join(__dirname, "../../packages/generator/templates/TS");

export async function installTSMongo() {
  try {
    const tempPath = path.join(main, "Database");
    const data: string = `import mongoose from 'mongoose';

async function Mongoconnect(url: string) {
  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to the MongoDB database.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

export default Mongoconnect;`;

    await fs.writeFile(path.join(tempPath, "mongo.ejs"), data, {
      encoding: "utf-8",
    });

    const modelsPath = path.join(main, "Models");

    const schema: string = `import mongoose, { Schema } from 'mongoose';

// Define schema
const MySchema: Schema = new Schema({
    // Define your schema fields here
    field1: { type: String, required: true },
    field2: { type: Number, required: true },
    // Add more fields as needed
});

// Create model
const MyModel = mongoose.model('MyModel', MySchema);

export default MyModel;
`;

    await fs.writeFile(path.join(modelsPath, "models.ejs"), schema, {
      encoding: "utf-8",
    });
  } catch (error: any) {
    console.error("Error installing Mongo:", error.stack);
  }
}

export async function installTSMSQL() {
  try {
    const tempPath = path.join(main, "Database");
    const data: string = `import mysql from 'mysql';

// Create connection
const connection = mysql.createConnection({
    host: process.env.HOST || "",
    user: process.env.USER || "",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE || "",
    port: process.env.DB_PORT || 3306,
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Close connection when done
// connection.end();
`;

    await fs.writeFile(path.join(tempPath, "sql.ejs"), data, {
      encoding: "utf-8",
    });

    const modelsPath = path.join(main, "Models");

    const schema: string = `CREATE TABLE IF NOT EXISTS TableName (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field1 VARCHAR(255) NOT NULL,
    field2 INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

    await fs.writeFile(path.join(modelsPath, "models.sql"), schema, {
      encoding: "utf-8",
    });
  } catch (error: any) {
    console.error("Error installing MySQL:", error.stack);
  }
}

export async function installTSPGSQL() {
  try {
    const tempPath = path.join(main, "Database");
    const data: string = `import { Client } from 'pg';

// Create a PostgreSQL client instance
const client = new Client({
    host: process.env.HOST || "",
    user: process.env.USER || "",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE || "",
    port: process.env.DB_PORT || 5432,
});

// Connect to the PostgreSQL database
client.connect()
    .then(() => {
        console.log('Connected to the PostgreSQL database');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    })
    .finally(() => {
        // Close the client when done
        // client.end();
    });
`;

    await fs.writeFile(path.join(tempPath, "pgsql.ejs"), data, {
      encoding: "utf-8",
    });

    const modelsPath = path.join(main, "Models");

    const schema: string = `CREATE TABLE IF NOT EXISTS TableName (
    id SERIAL PRIMARY KEY,
    field1 VARCHAR(255) NOT NULL,
    field2 INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

    await fs.writeFile(path.join(modelsPath, "models.sql"), schema, {
      encoding: "utf-8",
    });
  } catch (error: any) {
    console.error("Error installing PostgreSQL:", error.stack);
  }
}


