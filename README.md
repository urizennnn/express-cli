# Express cli tool in progress

## Aimed at making express applications faster and seamlesss
 For now are in development phase and you can only run script with the folder not outside the folder .

 # Build
 install typescript and run ``` tsc -w  ``` in root and after that cd into the dist/cli folder and run any of the following commands
  ```
node prompt.js create <app-name>
      or
node prompt.js new <app-name>
```
right now you'll just be asked question this is just to make sure while in development we do not have any OS based bugs no fuctionality is really added at the moment.

you can run 
```
 node prompt.js install <package-name>
         or
node prompt.js i <package-name>
```
Keep in mind that which ever package manager you chose in the first command will be stored and all commands will be used with that package manager and it's flags to are supported like ``` -D  will work and it is the same as -d```
for example 
  ```
node prompt.js install <package-name>
```
won't work if you chose yarn as your package manager and so on.


you can also run the remove command or it's alias   ``` ui or uninstall ``` 
