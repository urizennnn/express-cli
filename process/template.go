package process

import (
	"fmt"
	"os"
	"path/filepath"
	"text/template"

	"github.com/urizennnn/express-cli/errors"
)

func ProcessFilesAndFolders(langType string, currentFolderPath string) {
	err := filepath.Walk(currentFolderPath, func(path string, fileOrFolderInfo os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if fileOrFolderInfo.Name() == ".env" {
			return nil // Skip .env files
		}

		newFilePath := ChangeFileExtension(path, ".js")
		if err := CopyFileAndChangeExtension(path, newFilePath, langType); err != nil {
			return err
		}

		return nil
	})
	errors.Check_Err(err)
}

func CopyFileAndChangeExtension(srcFilePath, dstFilePath, langType string) error {
	fmt.Print(os.Getwd())
	fileData, err := os.ReadFile(srcFilePath)
	if err != nil {
		return err
	}

	// Create a new template with the content of fileData
	tmpl, err := template.New(langType).Parse(string(fileData))
	if err != nil {
		return err
	}

	newFile, err := os.Create(dstFilePath)
	if err != nil {
		return err
	}
	defer newFile.Close()

	// Execute the template with nil data
	return tmpl.Execute(newFile, nil)
}

func ChangeFileExtension(fileName, newExtension string) string {
	fileBase := filepath.Base(fileName)
	fileExt := filepath.Ext(fileBase)
	return filepath.Join(filepath.Dir(fileName), fileBase[:len(fileBase)-len(fileExt)]+newExtension)
}
