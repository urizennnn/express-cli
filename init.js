const os = require('os');
const platform = os.platform();
const fs = require('fs');
const path = require('path');

const pathtoFile = path.join(__dirname, 'package.json');
const fileContent = fs.readFileSync(pathtoFile, 'utf8');
const packageJson = JSON.parse(fileContent);
const fileTOWrite = path.join(__dirname, '.env');
fs.writeFile(fileTOWrite, `PLATFORM = "${platform}"`, (err) => {
    if (err) {
        console.log(err);
    }
}
);

if (platform === 'win32') {
    packageJson.bin.express = 'main.exe';
} else {
    packageJson.bin.express = 'main';
}


fs.writeFileSync(pathtoFile, JSON.stringify(packageJson, null, 2), 'utf8');
