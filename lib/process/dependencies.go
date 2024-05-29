//go:build !windows
// +build !windows

package process

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	"path"
	"path/filepath"

	"github.com/urizennnn/express-cli/errors"
)

type Dependency struct {
	Dependencies []string `json:"dependencies"`
	Dev          []string `json:"dev"`
}

func InstallDependencies(ext, manager, cwd string) {
	var jointPath string
	switch ext {
	case "js":
		jointPath = "generator/JS"
	case "ts":
		jointPath = "generator/TS"
	default:
		fmt.Println("Unsupported extension")
		os.Exit(1)
		return
	}
	const targetFile = "dependencies.json"

	files, err := fs.ReadDir(TemplateDir, jointPath)
	if err != nil {
		fmt.Println("Error reading directory:", err)
		os.Exit(1)
	}

	for _, file := range files {
		if !file.IsDir() {
			if file.Name() == targetFile {
				filePath := path.Join(jointPath, file.Name())
				content, err := TemplateDir.ReadFile(filePath)
				if err != nil {
					fmt.Println("Error reading file:", err)
					os.Exit(1)
				}

				var dependency Dependency
				err = json.Unmarshal(content, &dependency)
				if err != nil {
					fmt.Println("Error unmarshalling JSON:", err)
					os.Exit(1)
				}

				for _, dep := range dependency.Dependencies {
					cleaned_Dep := filepath.Clean(dep)
					command := exec.Command(manager, "install", cleaned_Dep)
					command.Dir = cwd
					err = command.Run()
					if err != nil {
						fmt.Println("Error installing dependency:", dep, err)
						os.Exit(1)
					}
				}

				for _, dev := range dependency.Dev {
					cleaned_Dev := filepath.Clean(dev)
					command := exec.Command(manager, "install", "--save-dev", cleaned_Dev)
					command.Dir = cwd
					err = command.Run()
					if err != nil {
						fmt.Println("Error installing dev dependency:", dev, err)
						os.Exit(1)
					}
				}
				return
			}
		}
	}

	fmt.Println("Target file not found:", targetFile)
}

func gitInit(cwd string) {
	commad := exec.Command("git", "init")
	commad.Dir = cwd
	err := commad.Run()
	errors.Check_Err(err)
}
func managerInit(cwd, manager string) {
	var command *exec.Cmd
	if manager == "npm" || manager == "yarn" {
		command = exec.Command(manager, "init", "-y")
		command.Dir = cwd
		err := command.Run()
		errors.Check_Err(err)
	} else {
		command = exec.Command(manager, "init")
		command.Dir = cwd
		err := command.Run()
		errors.Check_Err(err)
	}
}
