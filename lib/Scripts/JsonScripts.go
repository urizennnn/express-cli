package scripts

import (
	"encoding/json"
	Err "errors"
	"github.com/urizennnn/express-cli/errors"
	"os"
	"path/filepath"
)

func JsonScripts(cwd, ext string) {
	content, err := os.ReadDir(cwd)
	if err != nil {
		errors.Check_Err(err)
		return
	}

	switch ext {
	case "JavaScript":
		ext = ".js"
	case "TypeScript":
		ext = ".ts"
	default:
		errors.Check_Err(Err.New("unsupported extension"))
		os.Exit(1)
		return
	}

	for _, file := range content {
		if file.IsDir() {
			continue
		} else if file.Name() == "package.json" {
			filePath := filepath.Join(cwd, "package.json")
			fileContent, err := os.ReadFile(filePath)
			if err != nil {
				errors.Check_Err(err)
				os.Exit(1)
			}

			var pkgJson map[string]any
			err = json.Unmarshal(fileContent, &pkgJson)
			if err != nil {
				errors.Check_Err(err)
				os.Exit(1)
			}

			scripts, ok := pkgJson["scripts"].(map[string]string)
			if !ok {
				scripts = make(map[string]string)
			}

			scripts["start"] = "nodemon server" + ext
			pkgJson["scripts"] = scripts

			updatedContent, err := json.MarshalIndent(pkgJson, "", "  ")
			if err != nil {
				errors.Check_Err(err)
				os.Exit(1)
			}

			err = os.WriteFile(filePath, updatedContent, 0644)
			if err != nil {
				errors.Check_Err(err)
				os.Exit(1)
			}
		}
	}
}
