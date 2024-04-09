import chalk from "chalk";
import { exec } from "child_process";

export function createJsonUponFreshStart(PackageManager: string, name: string) {
  if (!PackageManager) {
    console.log(chalk.red("Error retrieving PackageManager"));
    process.exit(1);
  }

  process.chdir(name);
console.log(process.cwd());
  const generatePackageJson = new Promise<void>((resolve, reject) => {
    exec(`${PackageManager} init -y`, (error: Error | null) => {
      if (error) {
        console.error(`Error generating package.json: ${error}`);
        reject(error);
      } else {
        console.log(
          `Successfully generated package.json using ${PackageManager}`
        );
        resolve();
      }
    });
  });

  const installExpress = new Promise<void>((resolve, reject) => {
    exec(`${PackageManager} install express`, (error: Error | null) => {
      if (error) {
        console.error(chalk.red(`Error installing express: ${error}`));
        reject(error);
      } else {
        console.log(chalk.red(`Successfully installed express using ${PackageManager}`));
        resolve();
      }
    });
  });


  generatePackageJson
    .then(() => {
      return installExpress;
    })
    .catch((error) => {
      console.error(
        chalk.red(`Error during package.json generation or express installation: ${error}`)
      );
      process.exit(1);
    });
}
