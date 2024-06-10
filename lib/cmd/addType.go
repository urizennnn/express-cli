package cmd

import (
	"os"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	scripts "github.com/urizennnn/express-cli/lib/Scripts"
)

var addTypeCmd = &cobra.Command{
	Use:   "type <type-name>",
	Short: "A brief description of your command",
	Long:  `Add type definition to your code.`,
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			err := cmd.Help()
			errors.Check_Err(err)
		}
		cwd, err := os.Getwd()
		errors.Check_Err(err)
		err = scripts.AddTypeDefinition(cwd, args[0])
		errors.Check_Err(err)
	},
}

func init() {
	rootCmd.AddCommand(addTypeCmd)

}
