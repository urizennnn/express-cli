import { prompt, args, loadingBar } from "../config/cli.config";
import { exec, ExecException } from "child_process";

const question = [
  {
    type: "list",
    name: "package",
    message: "Choose package manager",
    choices: ["npm", "yarn", "pnpm"],
    default: "npm",
  },
  {
    type: "list",
    name: "language",
    message: "Choose language",
    choices: ["JavaScript", "TypeScript"],
    default: "JavaScript",
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

export function createExpress() {
  prompt(question).then((answer) => {
    return console.log(answer);
  });
}

export async function installDependencies(flags?: string, ...args: string[]) {
  const argv = args.join(" ");

  const chalk = await import("chalk");

  console.log(chalk.default.green(`Installing ${argv}...`));

  const interval = loadingBar();

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
