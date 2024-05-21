package process

import (
	"embed"
	err "errors"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/functions/config"
)

//go:embed all:generator
var TemplateDir embed.FS

func CopyFile(srcPath, destPath string, fsys embed.FS) error {
	input, err := fsys.ReadFile(srcPath)
	errors.Check_Err(err)

	err = os.MkdirAll(filepath.Dir(destPath), 0755)
	errors.Check_Err(err)

	err = os.WriteFile(destPath, input, 0644)
	errors.Check_Err(err)

	return nil
}

func copyDirRecursive(srcPath, destPath string, fsys embed.FS, ext string) error {
	entries, err := fs.ReadDir(fsys, srcPath)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		oldPath := filepath.Join(srcPath, entry.Name())
		newPath := filepath.Join(destPath, entry.Name())

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

func CopyFilesToCWD(cwd, name, ext string, isDone chan bool) error {
	go config.Spinner(isDone)
	folderPath := filepath.Join(cwd, name)
	if err := os.MkdirAll(folderPath, 0755); err != nil {
		errors.Check_Err(err)
	}

	var jointPath string
	switch ext {
	case "JavaScript":
		jointPath = "generator/JS"
	case "TypeScript":
		jointPath = "generator/TS"
	default:
		return err.New("unsupported extension")
	}

	if err := copyDirRecursive(jointPath, folderPath, TemplateDir, ext); err != nil {
		errors.Check_Err(err)
	}

	InstallDependencies(ext, folderPath)
	gitInit(folderPath)

	isDone <- true
	return nil
}
