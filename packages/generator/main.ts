import ejs from "ejs";
import fs from "fs-extra";
import path from "path";

export const generateFiles = async (targetDir:string, templateDir:string, extension:string,cdname?:string) => {
	const templatePath = path.join("../../../../packages/generator", templateDir);
    let appName = cdname as string
	const targetPath = path.join(targetDir, appName);
	await fs.ensureDir(targetPath);

	const files = await fs.readdir(templatePath);
	for (const file of files) {
		const filePath = path.join(templatePath, file);
		const stats = await fs.stat(filePath);

		if (stats.isFile()) {
			console.log(file)
			const template = await fs.readFile(filePath, "utf-8");
			const rendered = ejs.render(template, { appName });
			const targetFilePath = path.join(
				targetPath,
				`${path.parse(file).name}.${extension}`
			);

			await fs.writeFile(targetFilePath, rendered);

		}  else if (stats.isDirectory()) {
      const subDir = path.join(templateDir, file);
      await generateFiles(targetPath, subDir, extension,path.basename(file));
    }
        }
};
