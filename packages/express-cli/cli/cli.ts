import { generateFiles } from "../../generator/main.js";
import { prompt, loadingBar, preferences } from "../../config/cli.config.js";
import { exec } from "child_process";
import { createFolderAndWriteConfig } from "./helper.js";
import chalk from "chalk";


export async function createExpress(name: string): Promise<void> {
	const question = [
		{
			type: "list",
			name: "package",
			message: "Choose package manager?",
			choices: ["npm", "yarn", "pnpm"],
			default: "npm",
		},
		{
			type: "list",
			name: "language",
			message: "Choose language?",
			choices: ["JavaScript", "TypeScript"],
			default: "JavaScript",
		},
		{
			type: "list",
			name: "database",
			message: "What database are you using?",
			choices: ["MongoDB", "MSQL", "PGSQL", "Other"],
		},
		{
			type: "list",
			name: "dependency",
			message: "Would you like to add pre installed dependencies or a fresh start?",
			choices: ["pre installed", "fresh start"],
			default: "pre installed",
		},
	];

	prompt(question).then(async (answer) => {
		preferences.language = answer.language;
		preferences.database = answer.database;
		preferences.injection = answer.dependency;
		preferences.packageManager = answer.package;

		createFolderAndWriteConfig(preferences);
		if (answer.dependency === "fresh start"){
			await generateFiles(process.cwd(),"templates",name)
			
		}


		process.exit(0);
	});
}

export async function installDependencies(...args: string[]): Promise<void> {
	const argv: string = args.join(" ");

	console.log(chalk.green(`Installing ${argv}...`));
	const interval = loadingBar("Installing");

	const packageManager: string = preferences.packageManager || "npm";

	exec(`${packageManager} install ${argv}`, (error: Error | null, ) => {
		clearInterval(interval);
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write("\nInstalled [.........]");

		if (error) {
			console.error(`${packageManager} install error: ${error.message}`);
			return;
		}

		console.log(chalk.green(`\nSuccessfully installed ${argv}.`));
	});
}

export async function removeDependencies(...args: string[]): Promise<void> {
	const argv: string = args.join(" ");

	console.log(chalk.green(`Removing ${argv}...`));
	const interval = loadingBar("Removing");

	exec(`npm remove ${argv}`, (error: Error | null, ) => {
		clearInterval(interval);
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write("\nRemoved [.........]");

		if (error) {
			console.error(`npm remove error: ${error.message}`);
			return;
		}

		console.log(chalk.green(`\nSuccessfully removed ${argv}.`));
	});
}
