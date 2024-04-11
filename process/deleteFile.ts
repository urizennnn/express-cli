import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

export const deleteFile = async (filePath: string) => {
    try {
        const files = await fs.readdir(filePath);
        
        for (const file of files) {
            const filePathToDelete = path.join(filePath, file);
            await fs.unlink(filePathToDelete);
        }
    } catch (err) {
        console.error(chalk.red(`Error deleting files: ${err}`));
    }
};
export const deleteFolder = async (folderPath: string) => {
    try {
        await fs.remove(folderPath);
    } catch (err) {
        console.error(chalk.red(`Error deleting folder: ${err}`));
    } }
