import chalk from "chalk";
import {exec} from "child_process";
import path from "path"
export function createJsonUponFreshStart (PackageManager:string,name:string) {
	if (!PackageManager) {
		console.log(chalk.red('Error retrieving PackageManager'))
		process.exit(1)
	}
	process.chdir(name)
	exec(`${PackageManager} init -y`,(error:Error | null)=>{
		if (error) {
			console.log(`I could not generate package.json.\n Please try running "${PackageManager} init -y" yourself.`)
		}
	})
}

