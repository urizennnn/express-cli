package main

import (
	"github.com/joho/godotenv"
	"github.com/urizennnn/express-cli/cmd"
)

func main() {
	godotenv.Load()

	cmd.Execute()
}
