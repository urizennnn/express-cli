package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/functions/cli"
	"github.com/urizennnn/express-cli/process"
)

var Root string

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Build your express application.",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		isDone := make(chan bool)
		cwd, err := os.Getwd()
		errors.Check_Err(err)
		Root = cwd
		fmt.Println("Current working directory: ", cwd)
		skipInit, err := cmd.Flags().GetBool("y")
		if err != nil {
			panic(err)
		}

		if skipInit {
			cli.Skip()
		} else {
			cli.List()
			pre := cli.Preferences
			fmt.Println(pre)
			go process.CopyFilesToCWD(cwd, args[0], pre.Language, isDone)
			fmt.Println("Building your express application...")
		}

	},
}

func init() {
	rootCmd.AddCommand(initCmd)
	initCmd.Flags().BoolP("y", "y", false, "Skip the init process")
}
