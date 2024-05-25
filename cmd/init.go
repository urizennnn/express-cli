package cmd

import (
	Err "errors"
	"os"
	"time"

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
		if len(args) == 0 {
			errors.Check_Err(Err.New(config.Red + "No arguments provided" + config.Red))
			errors.Check_Err(Err.New(config.Red + "Turning off generators..." + config.Red))
			time.Sleep(3 * time.Second)
			return
		}

		cwd, err := os.Getwd()
		if err != nil {
			errors.Check_Err(err)
			return
		}
		Root = cwd

		skipInit, err := cmd.Flags().GetBool("y")
		if err != nil {
			errors.Check_Err(err)
			return
		}

		if skipInit {
			lines := cli.Skip()
			switch lines.Language {
			case "JavaScript":
				config.Run(cwd, args[0], "js")
			case "TypeScript":
				config.Run(cwd, args[0], "ts")
			default:
				errors.Check_Err(Err.New("unsupported language"))
				return
			}
		} else {
			cli.List()
			pre := cli.Preferences
			switch pre.Language {
			case "JavaScript":
				config.Run(cwd, args[0], "js")
			case "TypeScript":
				config.Run(cwd, args[0], "ts")
			default:
				errors.Check_Err(Err.New("unsupported language"))
				return
			}
		}
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
	initCmd.Flags().BoolP("y", "y", false, "Skip the init process")
}
