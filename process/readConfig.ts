import fse from "fs-extra"
import path from "path"
import {generateFiles} from "../packages/generator/main"
import {exit} from "node:process"
import chalk from "chalk"

export function readConfig (){
	const homeDir = process.env.USERPROFILE || process.env.HOME as string
	const configPath = path.join(homeDir,"@express-cli")
	const configFile = path.join(configPath, ".express.config.json")

	const data= fse.readJson(configFile)
	return data

}


export async function generateDefault(name:string,flag:boolean=true){

	try {
		const details = await readConfig()
		if (details.language === "TypeScript"){
			await generateFiles(process.cwd(),"templates",name,flag)
		} else {
			await generateFiles(process.cwd(),"templates",name,flag)
		}
	} catch (e) {
		console.log(chalk.red(e));
    exit(1);
	}

}

