import chalk from "chalk";
import {
  dependencies,
  devDependencies,
  devDependenciesWithTypes,
  preferences,
  dependenciesWithTypes
} from "../packages/config/cli.config";
import { exec } from "child_process";
import { promisify } from "util";
import { readConfig } from "./readConfig";

const asyncExec = promisify(exec);


export async function injectDefault(name: string, flag: boolean) {

  const data = await readConfig();
  const manager = preferences.packageManager || data?.packageManager;
  const command = getPackageManagerCommand(manager);

  try {
    await installDependencies(name, manager, command, dependencies);
    await installDependencies(name, manager, command, devDependencies, "-D");

    if (flag) {
      await installDependencies(
        name,
        manager,
        command,
        devDependenciesWithTypes,
        "-D"
      );
      await installDependencies(name, manager, command, dependenciesWithTypes);
    }
  } catch (error: any) {
    console.error(chalk.red(error.message));
  }
}

async function installDependencies(
  name: string,
  manager: string,
  command: string,
  dependenciesList: string[],
  flag: string = ""
) {
  for (const dependency of dependenciesList) {
    await asyncExec(`${manager} ${command} ${flag} ${dependency}`, {
      cwd: name,
      windowsHide: true,
    });
  }
}

function getPackageManagerCommand(manager: string | undefined): string {
  switch (manager) {
    case "npm":
    case "pnpm":
      return "install";
    case "yarn":
      return "add";
    default:
      throw new Error("Unsupported package manager");
  }
}


export const injectDb = async (
  targetPath: string,
  database: string,
  flag: boolean = false
) => {
  if (database === "MongoDB") {
    dependencies.push("mongoose");
    await injectDefault(targetPath, flag);
  } else if (database === "MSQL") {
    dependencies.push("mysql");
    await injectDefault(targetPath, flag);
  } else if (database === "PGSQL") {
    dependencies.push("pg");
    await injectDefault(targetPath, flag);
  } else if (database === "Other") {
    await injectDefault(targetPath, flag);
  }
};
