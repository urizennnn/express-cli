# Express cli tool in progress

## Aimed at making express applications faster and seamlesss
 For now are in development phase and you can only run script with the folder not outside the folder .

 # INSTALLATION FOR WINDOWS 
Copy the file path in which the repo has been cloned and add it to your environment variable 

## Commands
  ```
cli create <app-name>
      or
cli new <app-name>
```
right now you'll just be asked question this is just to make sure while in development we do not have any OS based bugs no fuctionality is really added at the moment.

you can run 
```
 cli install <package-name>
         or
cli i <package-name>
```
Keep in mind that which ever package manager you chose in the first command will be stored and all commands will be used with that package manager and it's flags to are supported like ``` -D  will work and it is the same as -d```
for example 
  ```
cli install <package-name>
```
won't work if you chose yarn as your package manager and so on.


you can also run the remove command or it's alias   ``` ui or uninstall ``` 
