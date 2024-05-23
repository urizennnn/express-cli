const os = require('os');
const platform = os.platform();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
execSync('go build main.go', { stdio: 'inherit', windowsHide: true });

if (platform === 'win32') {
    packageJson.bin.cli = './main';
} else {
    packageJson.bin.cli = 'main';
}


fs.writeFileSync(pathtoFile, JSON.stringify(packageJson, null, 2), 'utf8');
