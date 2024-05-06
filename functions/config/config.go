package config

type User struct {
	PackageManager string `json:"packageManager"`
	Language       string `json:"language"`
	Injection      string `json:"injection"`
	Database       string `json:"database"`
}

var Preferences = User{
	PackageManager: "",
	Language:       "",
	Injection:      "",
	Database:       "",
}

var Dependencies = []string{
	"express",
	"cookie-parser",
	"cors",
	"express-session",
	"helmet",
	"morgan",
	"http-status-codes",
	"dotenv",
}

var DevDependencies = []string{
	"nodemon",
	"eslint",
	"mocha",
	"chai",
	"prettier",
	"eslint",
}

var DependenciesWithType = []string{
	"@types/express",
	"@types/cookie-parser",
	"@types/cors",
	"@types/express-session",
	"@types/helmet",
	"@types/morgan",
	"@types/http-status-codes",
	"@types/dotenv",
	"ts-node",
}

var DevDependenciesWithType = []string{
	"@types/nodemon",
	"@types/eslint",
	"@types/mocha",
	"@types/chai",
	"@types/prettier",
	"@types/node",
	"@typescript-eslint/parser",
	"@typescript-eslint/eslint-plugin",
	"eslint-config-prettier",
	"eslint-plugin-prettier",
}
