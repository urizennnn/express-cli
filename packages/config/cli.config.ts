#!/usr/bin/env node

const { hideBin } = require('yargs/helpers');
import yargs from "yargs";

import inquirer from "inquirer"


export const args = hideBin(process.argv);
export const prompt = inquirer.createPromptModule()

export function loadingBar () {
    const totalTicks = 10;
    let ticks = 0;
    const loadingInterval = setInterval(() => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);

      const progress = ".".repeat(ticks) + " ".repeat(totalTicks - ticks);
      process.stdout.write(`Installing [${progress}]`);

      if (++ticks > totalTicks) {
        ticks = 0;
      }
    }, 100);
    return loadingInterval
}