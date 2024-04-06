import chalk from "chalk";
import ejs from "ejs";
import fs from "fs-extra";
import path from "path";

export const generateFiles = async (name: string, target: string, template: string, desiredExtension: string) => {
    const templateDir = path.join(__dirname, template);
    const targetDir = path.join(target, name);

    if (fs.existsSync(targetDir)) {
        console.log(chalk.red(`Folder ${name} already exists`));
        process.exit(1);
    }

    fs.mkdirSync(targetDir);

    const templateFiles = fs.readdirSync(templateDir);

    for (const file of templateFiles) {
        const filePath = path.join(templateDir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            await generateFiles(name, targetDir, path.join(template, file), desiredExtension); // Pass path.join(template, file) instead of filePath
        } else {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const fileName = file.replace(/\.ejs$/, desiredExtension);
            const targetFilePath = path.join(targetDir, fileName);

            const renderedContent = ejs.render(fileContent, { name });

            fs.writeFileSync(targetFilePath, renderedContent);
        }
    }
};
