#!/usr/bin/env node
import yargs from "yargs";
const { args } = require("../config/cli.config");
import { createExpress, installDependencies } from "./cli";

yargs.command({
  command: "create",
  describe: "Create a new express app",
  handler(args) {
    createExpress();
  },
});

yargs.command({
  command: "install",
  aliases: "i",
  describe: "Install dependencies",
  handler: (args) => {
    let flag;
    let entry;
    for (let key in args) {
      if (key === "D") {
        flag = key;
        entry = args[key];
        break;
      } else if (key === "d") {
        flag = key.toUpperCase();
        entry = args[key];
        break;
      }
    }
    flag = `-${flag}`;
    const packageNames = args._.slice(1) as unknown as string[];
    packageNames.push(entry);
    installDependencies(flag, ...packageNames);
  },
});
yargs.parse(args);
