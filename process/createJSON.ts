import chalk from "chalk";
import { exec } from "child_process";
import { readConfig } from "./readConfig";
import { exit } from "node:process";
import path from "path";
import fse from "fs-extra";

export async function createJsonUponFreshStart({ name, PackageManager }: { name: string; PackageManager?: string; }) {
  try {
    const details = await readConfig();
    PackageManager = PackageManager || details.packageManager;

    if (!PackageManager) {
      console.log(chalk.red("Error retrieving PackageManager"));
      exit(1);
    }

    const generatePackageJson = new Promise<void>((resolve, reject) => {
      exec(
        `${PackageManager} init -y`,
        { cwd: name, windowsHide: true },
        (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            console.error(`Error generating package.json: ${error}`);
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });

    const installExpress = new Promise<void>((resolve, reject) => {
      exec(
        `${PackageManager} install express`,
        { cwd: name, windowsHide: true },
        (error: Error | null, stdout: string, stderr: string) => {
          if (error) {
            console.error(chalk.red(`Error installing express: ${error}`));
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });

    const addScripts = async (name: string) => {
      const JsonPath = path.join(name, "package.json");
      const Json = await fse.readJson(JsonPath);
      Json.scripts = {
        start: "nodemon index.js",
      };
      await fse.writeJson(JsonPath, Json, { spaces: 2 });
    };

    await Promise.all([generatePackageJson, installExpress]);
    await addScripts(name);
  } catch (e) {
    console.log(chalk.red(e));
    exit(1);
  }
}