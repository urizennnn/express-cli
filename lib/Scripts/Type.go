package scripts

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/urizennnn/express-cli/errors"
)

func checkIfTSEnabled(cwd string) bool {
	rootDir := filepath.VolumeName(cwd) + string(os.PathSeparator)

	for {
		entries, err := os.ReadDir(cwd)
		errors.Check_Err(err)

		for _, entry := range entries {
			if !entry.IsDir() && entry.Name() == "tsconfig.json" {
				fmt.Printf("TypeScript enabled: tsconfig.json found in %s\n", cwd)
				return true
			}
		}

		parentDir := filepath.Dir(cwd)

		if parentDir == cwd || parentDir == rootDir {
			break
		}

		cwd = parentDir
	}

	fmt.Println("TypeScript not enabled: tsconfig.json not found")
	return false
}
func AddTypeDefinition(cwd, name string) error {
	if !checkIfTSEnabled(cwd) {
		return fmt.Errorf("TypeScript must be enabled to add type definition")
	}

	typesDir := filepath.Join(cwd, "types")
	err := os.MkdirAll(typesDir, os.ModePerm)
	if err != nil {
		return fmt.Errorf("failed to create types directory: %w", err)
	}

	file := filepath.Join(typesDir, name+".dto.ts")
	newFile, err := os.Create(file)
	errors.Check_Err(err)
	defer newFile.Close()
	if err != nil {
		return fmt.Errorf("failed to create type definition file: %w", err)
	}

	typeDef := `export type Test={}`
	_, err = newFile.Write([]byte(typeDef))
	errors.Check_Err(err)
	fmt.Printf("Type definition file created: %s\n", file)
	return nil
}
