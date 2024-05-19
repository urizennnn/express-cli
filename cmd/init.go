package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/process"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Build your express application.",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		cwd, err := os.Getwd()
		errors.Check_Err(err)
		fmt.Print(process.CopyFilesToCWD(cwd, args[0], args[1]))
		// skipInit, err := cmd.Flags().GetBool("y")
		// if err != nil {
		// 	panic(err)
		// }
		//
		// if skipInit {
		// 	cli.Skip()
		// } else {
		// 	cli.List()
		// }
		// cwd, err := os.Getwd()
		// errors.Check_Err(err)
		// err = process.CopycwdAndChangeExtension(Dir[0], cwd, "JS")
		// errors.Check_Err(err)

	},
}

func init() {
	rootCmd.AddCommand(initCmd)
	initCmd.Flags().BoolP("y", "y", false, "Skip the init process")
}
