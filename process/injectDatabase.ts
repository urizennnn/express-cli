import path from 'path';
import fs from 'fs-extra';
const main = path.join(__dirname, "../packages/generator/templates")


export async function installMongo (){
	
	const tempPath=path.join(main,"Database")
	const data = `const mongoose = require('mongoose');\n async function Mongoconnect(url) {\n try { \n  await mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });  \n console.log("Connected to the MongoDB database.");\n } catch (error) {\n console.error("Error connecting to the database:", error) \n }}\n\n \n module.exports = Mongoconnect;`

	await fs.writeFile(path.join(tempPath, 'mongo.ejs'),data,{encoding:'utf-8'})

	const modelsPath = path.join(main, 'Models')

	const schema = `const mongoose = require('mongoose');

// Define schema
const Schema = mongoose.Schema;
const MySchema = new Schema({
    // Define your schema fields here
    field1: { type: String, required: true },
    field2: { type: Number, required: true },
    // Add more fields as needed
});

// Create model
const MyModel = mongoose.model('MyModel', MySchema);

module.exports = MyModel;
`;

  await fs.writeFile(path.join(modelsPath, "models.ejs"), schema, {
    encoding: "utf-8",
  });
}

export async function installMSQL (){
	const tempPath=path.join(main,"Database")
	const data = `const mysql = require('mysql');

// Create connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'database_name'
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

	await fs.writeFile(path.join(tempPath, 'sql.ejs'),data,{encoding:'utf-8'})

	const modelsPath = path.join(main, 'Models')

	const schema = `CREATE TABLE IF NOT EXISTS TableName (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field1 VARCHAR(255) NOT NULL,
    field2 INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

`;

  await fs.writeFile(path.join(modelsPath, "models.ejs"), schema, {
    encoding: "utf-8",
  });
}


export async function installPGSQL() {
  const tempPath = path.join(main, "Database");
  const data = `const { Client } = require('pg');

// Create a PostgreSQL client instance
const client = new Client({
    user: 'username',
    host: 'localhost',
    database: 'database_name',
    password: 'password',
    port: 5432, // Default PostgreSQL port
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

  const schema = `CREATE TABLE IF NOT EXISTS TableName (
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
}


