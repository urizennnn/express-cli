const os = require('os');
const platform = os.platform();
const fs = require('fs');
const path = require('path');

const pathtoFile = path.join(__dirname, 'package.json');
const fileContent = fs.readFileSync(pathtoFile, 'utf8');
const packageJson = JSON.parse(fileContent);
console.log("We are trying to get what OS you use.")

if (platform === 'win32') {
    packageJson.bin.cli = './main';
} else {
    packageJson.bin.cli = 'main';
}


fs.writeFileSync(pathtoFile, JSON.stringify(packageJson, null, 2), 'utf8');
