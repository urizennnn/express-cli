package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/functions/config"
)

var RootDir string

var rootCmd = &cobra.Command{
	Use:   "cli",
	Short: "",
	Long:  `Express CLI is a command line tool for Express.js.`,
	Run: func(cmd *cobra.Command, args []string) {
		var err error
		RootDir, err = getRootDir()
		errors.Check_Err(err)

		flags, err := cmd.Flags().GetBool("v")
		errors.Check_Err(err)

		if flags {
			printVersion()
		}
	},
}

func Execute() {
	rootCmd.Flags().BoolP("v", "v", false, "Skip the init process")
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
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
