import fs from "fs";
import { prompt, loadingBar, preferences, devDependencies, getDevice } from "../config/cli.config";
import { exec, ExecException } from "child_process";
import { dependencies } from "../config/cli.config";

const question = [
  {
    type: "list",
    name: "package",
    message: "Choose package manager?",
    choices: ["npm", "yarn", "pnpm"],
    default: "npm",
  },
  {
    type: "list",
    name: "language",
    message: "Choose language?",
    choices: ["JavaScript", "TypeScript"],
    default: "JavaScript",
  },
  {
    type: "list",
    name: "database",
    message: "What database are you using?",
    choices: ["MongoDB", "MSQL", "PGSQL", "Other"],
  },
  {
    type: "list",
    name: "dependency",
    message:
      "Would you like to add pre installed dependencies or a fresh start?",
    choices: ["pre installed", "fresh start"],
    default: "pre installed",
  },
];

export function createExpress(name: string) {
  prompt(question).then(
    (answer: {
      database: string;
      dependency: string;
      package: string;
      language: string;
    }) => {
      preferences.database = answer.database;
      preferences.injection = answer.dependency;
      preferences.packageManager = answer.package;
      preferences.language = answer.language;
const device = getDevice();

      const path = `C:/Users/${device}/Desktop/${name}`;
      fs.mkdirSync(path);
      process.chdir(path);
      exec(
        `${preferences.packageManager} init -y `,
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error) {
            console.error(
              `${preferences.packageManager} install error: ${error.message}`
            );
            return;
          }
        }
      );
      if (preferences.injection === "pre installed") {
        installDependencies(...dependencies)
        if (preferences.language === 'TypeScript') installDependencies('-D',...devDependencies)
      }
    }
  );
}

export async function installDependencies(flags?: string, ...args: string[]) {
  const argv = args.join(" ");

  const chalk = await import("chalk");

  console.log(chalk.default.green(`Installing ${argv}...`));

  const interval = loadingBar("Installing");

  if (preferences.packageManager === "yarn") {
    exec(
      `${preferences.packageManager} add ${flags} ${argv}`,
      (error: ExecException | null, stdout: string, stderr: string) => {
        clearInterval(interval);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write("\nInstalled [.........]");
        if (error) {
          console.error(
            `${preferences.packageManager} install error: ${error.message}`
          );
          return;
        }

        console.log(chalk.default.green(`\nSuccessfully installed ${argv}.`));
      }
    );
  } else if (preferences.packageManager === "pnpm") {
    exec(
      `${preferences.packageManager} install ${flags} ${argv}`,
      (error: ExecException | null, stdout: string, stderr: string) => {
        clearInterval(interval);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write("\nInstalled [.........]");
        if (error) {
          console.error(`npm install error: ${error.message}`);
          return;
        }

        console.log(chalk.default.green(`\nSuccessfully installed ${argv}.`));
      }
    );
  } else {
    exec(
      `npm install ${flags} ${argv}`,
      (error: ExecException | null, stdout: string, stderr: string) => {
        clearInterval(interval);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write("\nInstalled [.........]");
        if (error) {
          console.error(`npm install error: ${error.message}`);
          return;
        }

        console.log(chalk.default.green(`\nSuccessfully installed ${argv}.`));
      }
    );
  }
}

export async function removeDependencies(...args: string[]) {
  const argv = args.join(" ");

  const chalk = await import("chalk");

  console.log(chalk.default.green(`Removing ${argv}...`));

  const interval = loadingBar("Removing");

  exec(
    `npm remove ${argv}`,
    (error: ExecException | null, stdout: string, stderr: string) => {
      clearInterval(interval);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write("\nRemoved [.........]");
      if (error) {
        console.error(`npm remove error: ${error.message}`);
        return;
      }

      console.log(chalk.default.green(`\nSuccessfully removed ${argv}.`));
    }
  );
}
