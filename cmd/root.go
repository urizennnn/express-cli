package cmd

import (
	"embed"
	"fmt"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/functions/config"
)

//go:embed version.js
var version embed.FS

var rootCmd = &cobra.Command{
	Use:   "cli",
	Short: "",
	Long:  `Express CLI is a command line tool for Express.js.`,
	Run: func(cmd *cobra.Command, args []string) {
		flags, err := cmd.Flags().GetBool("v")
		errors.Check_Err(err)
		if flags {
			out, err := exec.Command("node", "version.js").Output()
			if err != nil {
				errors.Check_Err(err)
			}
			fmt.Print("Express cli is at version " + config.Green + string(out) + config.Green)
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
