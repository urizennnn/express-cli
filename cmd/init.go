package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/functions/cli"
	"github.com/urizennnn/express-cli/functions/config"
)

var Root string

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Build your express application.",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		cwd, err := os.Getwd()
		errors.Check_Err(err)
		Root = cwd
		fmt.Println("Current working directory: ", cwd)
		skipInit, err := cmd.Flags().GetBool("y")
		if err != nil {
			panic(err)
		}

		if skipInit {
			lines := cli.Skip()
			switch lines.Language {
			case "JavaScript":
				config.Run(cwd, args[0], "js")
			case "TypeScript":
				config.Run(cwd, args[0], "ts")
			}
		} else {
			cli.List()
			pre := cli.Preferences
			switch pre.Language {
			case "JavaScript":
				config.Run(cwd, args[0], "js")
			case "TypeScript":
				config.Run(cwd, args[0], "ts")
			}

		}

		fmt.Println(config.Green + "Express application created successfully!" + config.Green)
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
	initCmd.Flags().BoolP("y", "y", false, "Skip the init process")
}
