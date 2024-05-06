package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"

	"github.com/urizennnn/express-cli/functions/config"
	"github.com/urizennnn/express-cli/spinner"
)

func Install(packageName ...string) {
	home, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	path := home + "/.express-cli/.express.config.json"
	contents, err := os.ReadFile(path)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	stringContents := string(contents)
	var obj config.User
	err = json.Unmarshal([]byte(stringContents), &obj)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	manager := obj.PackageManager

	// Separate the command and its arguments
	for _, pkg := range packageName {
		cmd := exec.Command(manager, "install", pkg)
		spinner.Run()

		// Set the command's output to be captured
		cmd.Stderr = os.Stderr
		cmd.Stdout = os.Stdout

		// Run the command
		err = cmd.Run()
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
	}
}
