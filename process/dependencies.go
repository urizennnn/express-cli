package process

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"os/exec"

	"github.com/urizennnn/express-cli/errors"
)

type Dependency struct {
	Dependencies []string `json:"dependencies"`
}

func InstallDependencies(ext, cwd string) {
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
	errors.Check_Err(err)

	for _, file := range files {
		if !file.IsDir() {
			if file.Name() == targetFile {
				filePath := fmt.Sprintf("%s/%s", jointPath, file.Name())
				content, err := TemplateDir.ReadFile(filePath)
				errors.Check_Err(err)

				var dependency Dependency

				err = json.Unmarshal(content, &dependency)
				errors.Check_Err(err)

				for _, dep := range dependency.Dependencies {
					commad := exec.Command("npm", "install", dep)
					commad.Dir = cwd
					err = commad.Run()
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
func npmInit(cwd string) {
	commad := exec.Command("npm", "init", "-y")
	commad.Dir = cwd
	err := commad.Run()
	errors.Check_Err(err)
}
