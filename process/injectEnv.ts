import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import {exit} from"node:process"


export async function injectEnv(db:string) {
  try {
    
    const tempPath: string = path.join(
      __dirname,
      "../packages/generator/templates"
    );
  
    if (db === "MongoDB") {
      const env = `
  MONGO_URI=your_mongo_uri
          `;
      const envFilePath = path.join(tempPath, ".env");
      await fs.writeFile(envFilePath, env);
    } else if (db === "MSQL") {
      const env = `
  MYSQL_HOST=your_mysql_host
  MYSQL_USER=your_mysql_user
  MYSQL_PASSWORD=your_mysql_password
  MYSQL_DATABASE=your_mysql_database
          `;
      const envFilePath = path.join(tempPath, ".env");
      await fs.writeFile(envFilePath, env);
    } else if (db === "PGSQL") {
      const env = `
  PGSQL_HOST=your_pgsql_host
  PGSQL_USER=your_pgsql_user
  PGSQL_PASSWORD=your_pgsql_password
  PGSQL_DATABASE=your_pgsql_database
          `;
      const envFilePath = path.join(tempPath, ".env");
      await fs.writeFile(envFilePath, env);
    } else {
      console.error("Unsupported database type");
    }
  } catch (e) {
    console.log(chalk.red(e))
    exit(1)
  }
}

