package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func CreateFolderAndWriteConfig(preferences User) {
	userProfile, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("\x1b[31;4mUnable to determine user profile directory.\x1b[0m")
		return
	}

	folderPath := filepath.Join(userProfile, "@express-cli")
	filePath := filepath.Join(folderPath, ".express.config.json")

	err = os.MkdirAll(folderPath, 0755)
	if err != nil {
		fmt.Printf("\x1b[31;4mError creating folder: %v\x1b[0m\n", err)
		return
	}

	file, err := os.Create(filePath)
	if err != nil {
		fmt.Printf("\x1b[31;4mError creating file: %v\x1b[0m\n", err)
		return
	}
	defer file.Close()

	jsonData, err := json.MarshalIndent(preferences, "", "    ")
	if err != nil {
		fmt.Printf("\x1b[31;4mError marshaling JSON: %v\x1b[0m\n", err)
		return
	}

	_, err = file.Write(jsonData)
	if err != nil {
		fmt.Printf("\x1b[31;4mError writing to file: %v\x1b[0m\n", err)
		return
	}

	fmt.Println("\x1b[32mConfig file successfully created!\x1b[0m")
}
