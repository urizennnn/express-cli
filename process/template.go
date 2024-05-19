package process

import (
	"embed"
	"errors"
	"io/fs"
	"log"
	"os"
	"path/filepath"
)

//go:embed generator
var TemplateDir embed.FS

func ChangeFileExtension(filename, newExt string) string {
	ext := filepath.Ext(filename)
	return filename[:len(filename)-len(ext)] + newExt
}

func CopyFile(srcPath, destPath string, fsys embed.FS) error {
	input, err := fsys.ReadFile(srcPath)
	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(destPath), 0755); err != nil {
		return err
	}

	if err := os.WriteFile(destPath, input, 0644); err != nil {
		return err
	}

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
				newPath = ChangeFileExtension(newPath, "."+ext)
				if err := CopyFile(oldPath, newPath, fsys); err != nil {
					return err
				}
			}
		}
	}

	return nil
}

func CopyFilesToCWD(cwd, name, ext string) error {
	folderPath := filepath.Join(cwd, name)
	if err := os.MkdirAll(folderPath, 0755); err != nil {
		return err
	}

	var jointPath string
	switch ext {
	case "js":
		jointPath = "generator/JS"
	case "ts":
		jointPath = "generator/TS"
	default:
		return errors.New("unsupported extension")
	}

	if err := copyDirRecursive(jointPath, folderPath, TemplateDir, ext); err != nil {
		return err
	}

	InstallDependencies(ext, folderPath)
	return nil
}

func main() {
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatalf("Failed to get current working directory: %v", err)
	}

	err = CopyFilesToCWD(cwd, "projectName", "js")
	if err != nil {
		log.Fatalf("Failed to copy files: %v", err)
	}
}
