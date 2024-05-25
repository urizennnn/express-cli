# Version 2.0 Release Notes
We are excited to announce a major update to our application, now rewritten entirely in Go to take advantage of its performance and cross-platform compiled binaries.

### New Features

## Command Line Interface (CLI)
The CLI has been redesigned with a new streamlined command for initializing projects:
```express init <folder-name>```
This will create a new application with default dependencies pre-installed for an Express application, as well as an initialized Git repository.

## Flags
The --y flag can still be used to bypass prompts and use previous configurations.
Warning: The CLI must be initialized through prompts before the --y flag can be used. Using the flag without prior initialization will result in a panic.

## Breaking Changes

The entire codebase has been rewritten in Go.
The process for creating a new application has changed, as described above.
Database and dependency selection has been removed from the initialization process to simplify the workflow.

## Windows Support 
Available for Windows users, the CLI can now be used on Windows machines to create and manage Express applications.

## Support
If you encounter any issues or have suggestions for improvements, please open an issue on our repository. We value your feedback and are committed to providing a seamless development experience.
Thank you for your continued support!

**Full Changelog**: https://github.com/urizennnn/express-cli/compare/v1.4.10...v2.1.4

