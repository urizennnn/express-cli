import { exec } from "child_process";

export async function initTs(cwd: string) {
  try {
    
      exec("tsc --init", { cwd, windowsHide: true });
    
  } catch (err: any) {
    throw new Error(err);
  }
}
