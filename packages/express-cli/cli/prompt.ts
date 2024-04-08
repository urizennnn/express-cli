#!/usr/bin/env node
import  yargs from "yargs";
import {args,prompt} from "../../config/cli.config.js"
import { createExpress, installDependencies, removeDependencies } from "./cli.js";
import {generateDefault} from "../../../process/readConfig.js";


yargs.command({
	command: "create <appName>", 
	aliases: ["new"],
	describe: "Create a new express app",
	builder:{
		y:{
			description:"Skip prompt",
			type:'boolean'
		},
	},
	async handler(args) {
		const appName = args.appName;
		const confirm = args.y
		if (confirm) {
			const response =  await prompt([{name:confirm,message:"This will previous Configuration. Would you like to continue?",type:confirm}])
			if (response){
			 await generateDefault(appName)
				process.exit(0)
			}
		}

		await createExpress(appName); 
	}
},
			 );


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
					 const packageNames = args._.slice(1) as string[]
					 packageNames.push(entry);

					 installDependencies(flag, ...packageNames);
				 },
			 });

			 yargs.command({
				 command:'remove',
				 aliases:['uninstall','ui','rm'],
				 describe:'remove dependencies',
				 handler: (args)=>{
					 const packageNames = args._.slice(1) as string[]
					 removeDependencies(...packageNames)
				 }
			 })
			 yargs.parse(args);
