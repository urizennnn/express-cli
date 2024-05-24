package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/functions/config"
	"os"
	"os/exec"
)

var RootDir string

// versionCmd represents the version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Return the version the cli-tool installed",
	Long:  `Return the version the cli-tool installed`,
	Run: func(cmd *cobra.Command, args []string) {
		var err error
		RootDir, err = getRootDir()
		errors.Check_Err(err)
		printVersion()
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)

}
func getRootDir() (string, error) {
	if os.Getenv("PLATFORM") == "windows" {
		return os.Getenv("USERPROFILE") + "\\AppData\\Roaming\\npm\\node_modules\\@urizen\\express-cli", nil
	}
	return "/usr/lib/node_modules/@urizen/express-cli", nil
}

func printVersion() {
	// versionFile, err := os.ReadDir(RootDir)
	// errors.Check_Err(err)
	data, err := getRootDir()
	errors.Check_Err(err)
	file := data + "/version.js"
	out, err := exec.Command("node", file).Output()
	errors.Check_Err(err)

	fmt.Print("Express CLI is at version " + config.Green + string(out) + config.Green)
}
