import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";

const execPromise = promisify(exec);

export async function initTs(path: string) {
  try {
    const { stdout, stderr } = await execPromise("tsc --init", {
      cwd: path,
      windowsHide: true,
    });
;
  } catch (err:any) {
   throw new Error(err)
  }
}
