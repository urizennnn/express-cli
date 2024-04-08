#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import path from "node:path";
import minimist from "minimist";
import inquirer from "inquirer";

export interface User {
  packageManager: string;
  language: string;
  injection: string;
  database: string;
}

export const args = hideBin(process.argv);
export const prompt = inquirer.createPromptModule();

export function loadingBar(command:string) {
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

export let preferences :User= {
  packageManager: "",
  language: "",
  injection: "",
  database: "",
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


