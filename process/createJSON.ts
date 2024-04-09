import chalk from "chalk";
import { exec } from "child_process";
import { readConfig } from "./readConfig";
import { exit } from "node:process";

export async function createJsonUponFreshStart({
  name,
  PackageManager,
}: {
  name: string;
  PackageManager?: string;
}) {
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
        { cwd: name },
        (error: Error | null) => {
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
        { cwd: name },
        (error: Error | null) => {
          if (error) {
            console.error(chalk.red(`Error installing express: ${error}`));
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });

    await generatePackageJson;
    await installExpress;
  } catch (e) {
    console.log(chalk.red(e));
    exit(1);
  }
}
