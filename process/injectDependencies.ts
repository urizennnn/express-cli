import chalk from "chalk";
import {
  dependencies,
  devDependencies,
  preferences,
  
} from "../packages/config/cli.config";
import { exec } from "child_process";
import { promisify } from "util";
import { readConfig } from "./readConfig";

const asyncExec = promisify(exec);

export async function injectDefault(name: string) {
  let command = "";
  const data = await readConfig();
  if (
    preferences.packageManager ||
    data.packageManager === "npm" ||
    preferences.packageManager ||
    data.packageManager === "pnpm"
  ) {
    command = "install";
  } else if (preferences.packageManager || data.packageManager === "yarn") {
    command = "add";
  }
  let manager:string;
  if (preferences.packageManager === undefined) {
    manager =  data.packageManager;
  }else {
    manager = preferences.packageManager
  }
  for (const dev of dependencies) {
    try {
      await asyncExec(
        `${manager} ${command} ${dev} `,
        {
          cwd: name,
        }
      );
    } catch (err: any) {
      console.error(chalk.red(err.message));
    }
  }
  for (const dev of devDependencies) {
    try {
      await asyncExec(
        `${manager} ${command} -D ${dev} `,
        {
          cwd: name,
        }
      );
    } catch (err: any) {
      console.error(chalk.red(err.message));
    }
  }
}

export const injectDb = async (targetPath:string,database:string)=>{
   if (database === "MongoDB") {
    dependencies.push("mongoose");
    await injectDefault(targetPath);
  } else if (database === "MSQL") {
    dependencies.push("mysql");
    await injectDefault(targetPath);
  } else if (database === "PGSQL") {
    dependencies.push("pg");
    await injectDefault(targetPath);
  } else if (database === "Other") {
    await injectDefault(targetPath);
  }
}