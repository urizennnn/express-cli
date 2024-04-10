# Express cli tool in progress

## Aimed at making express applications faster and seamlesss
 For now are in development phase and you can only run script with the folder not outside the folder .

 # INSTALLATION FOR WINDOWS 

 ## Steps
 First run `npm i` then `npm run build` to build the file, then copy the templates folder which can be found in `packages/generator/` and paste it in `dist/packages/generator/`.
Copy the file path in which the repo has been cloned and add it to your environment variable 

## Commands
  ```
urizen create <app-name> [flag] --y (optional, for no interaction)
      or
urizen new <app-name> --y (optional, for no interaction)
```

you can run 
```
 urizen install <package-name>
         or
urizen i <package-name>
```
Keep in mind that which ever package manager you chose in the first command will be stored and all commands will be used with that package manager and it's flags to are supported like ``` -D  will work and it is the same as -d```
for example 
  ```
urizen install <package-name>
```
won't work if you chose yarn as your package manager and so on.


you can also run the remove command or it's alias   ``` ui or uninstall ``` 
