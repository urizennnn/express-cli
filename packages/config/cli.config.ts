#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import minimist from "minimist";
import inquirer from "inquirer";

export interface User {
  packageManager: undefined | string;
  language: undefined | string;
  injection: undefined | string;
  database: undefined | string;
}

export const args = hideBin(process.argv);
export const prompt = inquirer.createPromptModule();

export function loadingBar(command: string) {
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
  return loadingInterval;
}

export function loadingBarPromise(command: string): Promise<void> {
  const totalTicks = 10;
  let ticks = 0;
  return new Promise((resolve) => {
    const loadingInterval = setInterval(() => {
      ticks++;
      const progress = ".".repeat(ticks) + " ".repeat(totalTicks - ticks);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${command} [${progress}]`);
      if (ticks >= totalTicks) {
        clearInterval(loadingInterval);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        resolve();
      }
    }, 100);
  });
}


export let preferences :User= {
  packageManager: undefined,
  language: undefined,
  injection: undefined,
  database: undefined,
};

export const dependencies = [
  "express",
  "cookie-parser",
  "cors",
  "express-session",
  "helmet",
  "morgan",
  "http-status-codes",
  "dotenv"
];

export const devDependencies = [
  "nodemon",
  "eslint",
  "mocha",
  "chai",
  "prettier",
];


