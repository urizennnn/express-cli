#!/usr/bin/env node
import yargs from "yargs";
const { args } = require("../config/cli.config");
import { createExpress, installDependencies, removeDependencies } from "./cli";
const Generator = require('../../generator-express/generators/index.js')

yargs.command({
  command: "create <appName>", 
  aliases: ["new"],
  describe: "Create a new express app",
  handler(args) {
    const appName = args.appName; 
    let generator = new Generator();
    createExpress(appName); 
    // console.log(appName)
  },
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
    const packageNames = args._.slice(1)  as string[];
    packageNames.push(entry);
    installDependencies(flag, ...packageNames);
  },
});

yargs.command({
  command:'remove',
  aliases:['uninstall','ui','rm'],
  describe:'remove dependencies',
  handler: (args)=>{
       const packageNames = args._.slice(1) as string[];
       removeDependencies(...packageNames)
  }
})
yargs.parse(args);
