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
    const packageNames = args._.slice(1) as unknown as string
    installDependencies(...packageNames);

  }
});
yargs.parse(args);
