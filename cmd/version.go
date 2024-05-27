package cmd

import (
	"fmt"
	"runtime"

	"os"
	"os/exec"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/functions/config"
)

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Return the version the cli-tool installed",
	Long:  `Return the version the cli-tool installed`,
	Run: func(cmd *cobra.Command, args []string) {
		var err error
		errors.Check_Err(err)
		printVersion()
	},
}
var PLATFORM = runtime.GOOS

func init() {
	rootCmd.AddCommand(versionCmd)

}
func getRootDir() (string, error) {
	if PLATFORM == "windows" {
		return os.Getenv("USERPROFILE") + "\\AppData\\Roaming\\npm\\node_modules\\@urizen\\express-cli", nil
	}
	return "/usr/lib/node_modules/@urizen/express-cli", nil
}

func printVersion() {
	data, err := getRootDir()
	errors.Check_Err(err)
	var file string
	if PLATFORM == "windows" {
		file = data + "\\version.js"
	} else {
		file = data + "/version.js"
	}

	version, err := exec.Command("node", file).Output()
	errors.Check_Err(err)

	fmt.Print("Express CLI is at version " + config.Green + string(version) + config.Green)
}
