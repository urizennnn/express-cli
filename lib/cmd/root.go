package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/lib/functions/config"
)

var rootCmd = &cobra.Command{
	Use:   "express",
	Short: "",
	Long:  `Express CLI is a command line tool for Express.js.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	// Run: func(cmd *cobra.Command, args []string) { },
}

const (
	packageName = "@urizen/express-cli"
)

var linstalledVersion = Version()

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	version, err := GetCurrentVersionFromNpm(packageName)
	if err != nil {
		os.Exit(1)
	}
	if version != linstalledVersion {
		fmt.Printf(config.Red+"A new version of %s is available. Run `npm install -g %s` to update.\n"+config.Reset, packageName, packageName)
	}
	err = rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}
