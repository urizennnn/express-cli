package errors

import (
	"fmt"
	"os"
)

func Check_Err(err error) {
	if err != nil {
		if os.Getenv("STAGE") == "DEV" {
			panic(err)
		} else {
			fmt.Println(err)
		}
	}
}
