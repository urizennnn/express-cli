#!/usr/bin/env node
const { hideBin } = require('yargs/helpers');
import inquirer from "inquirer"
interface User {
  packageManager:string,
  language:string,
  injection:string,
  database:string
}

export const args = hideBin(process.argv);
export const prompt = inquirer.createPromptModule()

export function loadingBar (command:string) {
    const totalTicks = 10;
    let ticks = 0;
    const loadingInterval = setInterval(() => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);

      const progress = ".".repeat(ticks) + " ".repeat(totalTicks - ticks);
      process.stdout.write(`${command} [${progress}]`);

      if (++ticks > totalTicks) {
        ticks = 0;
      }
    }, 100);
    return loadingInterval
}

export let preferences :User =  {
  packageManager:'',
  language:'',
  injection:'',
  database:''
}