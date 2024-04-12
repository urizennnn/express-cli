

# Usage
## Installation 
First install the npm package with `npm i -g @urizen/express-clli 

To initialize an express application run 
` cli new <folderName> [flag] --y(optional)
          or
cli create <folderName>  [flag] --y(optional)
`
Using the flag skips the prompting steps and directly scaffolds a new app based on your last usage.

An alternative to `npm i <packageName> `, you can also use ` cli i <packageName>` This takes in all the flags as the regular npm installation 


Like wise you can also run `cli ui<packagename> or cli uninstall <packageName> `


# Testing 
For pre-release testing of features clone the repo annd edit the urizen.bat file and remove C/Users/name/Desktop and place in yours.

Then build the package with the npm run build commands and add the folder path to you systems variable e.g C/Users/name/Desktop/express-cli and then run all the commands as normal but instead of cli as keyword use urizen as keyword
