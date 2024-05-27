package process

import (
	"embed"
	"fmt"
	"io/fs"
	"os"
	"path"

	"context"
	err "errors"

	"github.com/urizennnn/express-cli/errors"
	scripts "github.com/urizennnn/express-cli/lib/Scripts"
)

//go:embed all:generator
var TemplateDir embed.FS

func CopyFile(srcPath, destPath string, fsys embed.FS) error {
	input, err := fsys.ReadFile(srcPath)
	errors.Check_Err(err)

	err = os.MkdirAll(path.Dir(destPath), 0755)
	errors.Check_Err(err)

	err = os.WriteFile(destPath, input, 0644)
	errors.Check_Err(err)

	return nil
}

func copyDirRecursive(srcPath, destPath string, fsys embed.FS, ext string) error {
	entries, err := fs.ReadDir(fsys, srcPath)
	if err != nil {
		errors.Check_Err(err)
	}

	for _, entry := range entries {
		oldPath := path.Join(srcPath, entry.Name())
		newPath := path.Join(destPath, entry.Name())

		if entry.IsDir() {
			if err := copyDirRecursive(oldPath, newPath, fsys, ext); err != nil {
				return err
			}
		} else {
			if entry.Name() != "dependencies.json" {
				if entry.Name() == ".eslintrc.js" || entry.Name() == ".prettierrc" {
					err := CopyFile(oldPath, newPath, fsys)
					errors.Check_Err(err)
				}
				if err := CopyFile(oldPath, newPath, fsys); err != nil {
					return err
				}
			}
		}
	}

	return nil
}

func CopyFilesToCWD(cwd, name, manager, ext string, ctx context.CancelFunc) error {
	defer ctx()
	folderPath := path.Join(cwd, name)
	fileCheck := checkFileExists(folderPath)
	if fileCheck {
		fmt.Println("\033[31m" + "folder already exists" + "\033[0m")
		os.Exit(1)
	}
	if err := os.MkdirAll(folderPath, 0755); err != nil {
		errors.Check_Err(err)
	}
	fmt.Printf("This is manager %v", manager)
	managerInit(folderPath, manager)

	var jointPath string
	switch ext {
	case "js":
		jointPath = "generator/JS"
	case "ts":
		jointPath = "generator/TS"
	default:
		return err.New("invalid extension")
	}

	if err := copyDirRecursive(jointPath, folderPath, TemplateDir, ext); err != nil {
		errors.Check_Err(err)
	}
	InstallDependenciesUnix(ext, manager, folderPath)
	gitInit(folderPath)
	var language string
	switch ext {
	case "js":
		language = "JavaScript"
	case "ts":
		language = "TypeScript"
	default:
		return err.New("invalid extension")
	}
	defer scripts.JsonScripts(folderPath, language)

	return nil
}

func checkFileExists(filePath string) bool {
	if _, err := os.Stat(filePath); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}
