#!/usr/bin/env node
import path from "path";
import yargs from "yargs";
import { args, prompt } from "../../config/cli.config.js";
import {
  createExpress,
  installDependencies,
  removeDependencies,
} from "./cli.js";

import { deleteFile } from "../../../process/deleteFile.js";
import { exit } from "node:process";
import { generateDefaultFiles } from "../../generator/main.js";

export const temp = path.join(__dirname,"../../generator/templates");

yargs.command({
  command: "create <appName>",
  aliases: ["new"],
  describe: "Create a new express app",
  builder: {
    y: {
      description: "Skip prompt",
      type: "boolean",
    },
  },
  async handler(args) {
    const appName = args.appName;
    const confirm = args.y;
    if (confirm) {
      const response = await prompt([
        {
          name: confirm,
          message:
            "This will use previous Configuration. Would you like to continue?(default:yes)",
          type: confirm,
        },
      ]);
      if (response) {
        if (response === "no" || response === "n" || response === "N") {
          await createExpress(appName);
          return exit(1);
        }else {
          await generateDefaultFiles(process.cwd(), "templates", appName, true);
          return exit(1);
        }
        
      }
      
    }
   await createExpress(appName)

 

  }
});

yargs.command({
  command: "install",
  aliases: ["i"],
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
    const packageNames = args._.slice(1) as string[];
    packageNames.push(entry);

    installDependencies(flag, ...packageNames);
  },
});

yargs.command({
  command: "remove",
  aliases: ["uninstall", "ui", "rm"],
  describe: "remove dependencies",
  handler: (args) => {
    const packageNames = args._.slice(1) as string[];
    removeDependencies(...packageNames);
  },
});
yargs.parse(args);
