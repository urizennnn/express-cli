import chalk from "chalk";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function gitInit(path: string): Promise<void> {
  try {
    await execPromise(`git init`, { cwd: path, windowsHide: true });
  } catch (error: any) {
    console.error(chalk.red(`git init error: ${error.message}`));
    throw new Error(`git init error: ${error.message}`);
  }
}
