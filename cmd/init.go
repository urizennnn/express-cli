package cmd

import (
	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/functions/cli"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Build your express application.",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		skipInit, err := cmd.Flags().GetBool("y")
		if err != nil {
			panic(err)
		}

		if skipInit {
			cli.Skip()
		} else {
			cli.List()
		}
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
	initCmd.Flags().BoolP("y", "y", false, "Skip the init process")
}
