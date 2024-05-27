const fs = require('fs');
const path = require('path');
const os = require('os');

const USERPROFILE = os.homedir();
const MAIN_FILE = "windows";

const INSTALL_PATH = path.join(USERPROFILE, 'AppData', 'Roaming', 'npm');
const BATCH_FILE = path.join(INSTALL_PATH, 'express.cmd');
const PWSH_PATH = path.join(INSTALL_PATH, 'express.ps1');

function UPDATE_WINDOWS_CONFIG() {
    const batchFileContent = `@ECHO off

GOTO start

:find_dp0
SET dp0=%~dp0
EXIT /b

:start
SETLOCAL
CALL :find_dp0
"%dp0%\\node_modules\\@urizen\\express-cli\\bin\\${MAIN_FILE}" %*`;

    const pwshFileContent = `#!/usr/bin/env pwsh

$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | & "$basedir/node_modules/@urizen/express-cli/bin/${MAIN_FILE}" $args
} else {
  & "$basedir/node_modules/@urizen/express-cli/bin/${MAIN_FILE}" $args
}

exit $LASTEXITCODE`;

    const gccSupport = `#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case uname in
    CYGWIN|MINGW|MSYS)
        if command -v cygpath > /dev/null 2>&1; then
            basedir=cygpath -w "$basedir"
        fi
    ;;
esac

exec "$basedir/node_modules/@urizen/express-cli/bin/${MAIN_FILE}"   "$@"`

    fs.writeFile(BATCH_FILE, batchFileContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to batch file:', err);
        }
    });

    fs.writeFile(PWSH_PATH, pwshFileContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to pwsh file:', err);
        }
    });

    fs.writeFile(path.join(INSTALL_PATH, 'express'), gccSupport, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to pwsh file:', err);
        }
    });
}

if (process.platform === 'win32') {
    UPDATE_WINDOWS_CONFIG();
}
