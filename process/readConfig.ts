import fse from "fs-extra"
import path from "path"
import {generateFiles} from "../packages/generator/main"

export function readConfig (){
	const homeDir = process.env.USERPROFILE || process.env.HOME as string
	const configPath = path.join(homeDir,"@express-cli")
	const configFile = path.join(configPath, ".express.config")

	return fse.readJson(configFile)

}


export async function generateDefault(name:string,flag:boolean=true){
	const details = await readConfig()
	if (details.language === "TypeScript"){
		await generateFiles(process.cwd(),"templates",name,flag)
	} else {
		await generateFiles(process.cwd(),"templates",name,flag)
	}

}

