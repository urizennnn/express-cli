import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { exit } from "node:process";

export async function injectEnv(db: string) {
  try {
    const tempPath: string = path.join(
      __dirname,
      "../packages/generator/templates"
    );

    if (db === "MongoDB") {
      const env = `
  MONGO_URI=your_mongo_uri
  JWT_SECRET=your_jwt_secret
  JWT_LIMIT=30d 
          `;
      const envFilePath = path.join(tempPath, ".env");
      await fs.writeFile(envFilePath, env);
    } else if (db === "MSQL") {
      const env = `
  MYSQL_HOST=localhost
  MYSQL_USER=root
  MYSQL_PASSWORD=
  MYSQL_DATABASE=database
  JWT_SECRET=your_jwt_secret
  JWT_LIMIT=30d 
          `;
      const envFilePath = path.join(tempPath, ".env");
      await fs.writeFile(envFilePath, env);
    } else if (db === "PGSQL") {
      const env = `
  PGSQL_HOST=localhost
  PGSQL_USER=root
  PGSQL_PASSWORD=
  PGSQL_DATABASE=database
  JWT_SECRET=your_jwt_secret
  JWT_LIMIT=30d 
          `;
      const envFilePath = path.join(tempPath, ".env");
      await fs.writeFile(envFilePath, env);
    } else {
      const env = `
  DATABASE_URI=your_database_uri
  JWT_SECRET=your_jwt_secret
  JWT_LIMIT=30d 
          `;
      const envFilePath = path.join(tempPath, ".env");
      await fs.writeFile(envFilePath, env);
    }
  } catch (e) {
    console.log(chalk.red(e));
    exit(1);
  }
}
