package cmd

import (
	"embed"
	"fmt"
	"io/fs"

	"github.com/spf13/cobra"
	"github.com/urizennnn/express-cli/errors"
	// "github.com/urizennnn/express-cli/functions/cli"
)

var (

	//go:embed generator
	Template_Dir embed.FS
)
var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Build your express application.",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		Dir := read_Embedded_Files()
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
		// file, err := os.Getwd()
		// errors.Check_Err(err)
		// err = process.CopyFileAndChangeExtension(Dir[0], file, "JS")
		// errors.Check_Err(err)
		fmt.Print(Dir)
	},
}

func init() {
	rootCmd.AddCommand(initCmd)
	initCmd.Flags().BoolP("y", "y", false, "Skip the init process")
}

func read_Embedded_Files() []fs.DirEntry {
	Dir, err := Template_Dir.ReadDir("generator/JS")
	errors.Check_Err(err)

	for _, i := range Dir {
		if i.IsDir() {

		} else {
			fmt.Println(i.Name())
		}

	}
	return Dir

}
