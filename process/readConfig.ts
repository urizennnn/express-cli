import fse from "fs-extra"
import path from "path"
import {generateFiles} from "../packages/generator/main"

export async function generateDefault(name:string){
	const homeDir = process.env.USERPROFILE || process.env.HOME as string
	const configPath = path.join(homeDir,"@express-cli")
    const configFile = path.join(configPath, ".express.config")

	const details = await fse.readJson(configFile)
	
	if (details.language === "TypeScript"){
		await generateFiles(process.cwd(),"templates","ts",name)
	} else {
		await generateFiles(process.cwd(),"templates","js",name)
	}

}

