package cli

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	options := []string{"Option 1", "Option 2", "Option 3"}

	reader := bufio.NewReader(os.Stdin)
	for {
		printOptions(options)
		fmt.Print("Enter your choice (1-3): ")

		input, _ := reader.ReadString('\n')
		input = strings.TrimSpace(input)

		choice, err := strconv.Atoi(input)
		if err != nil || choice < 1 || choice > len(options) {
			fmt.Println("Invalid choice. Please try again.")
			continue
		}

		selectedOption := options[choice-1]
		fmt.Printf("You selected: %s\n", selectedOption)
		break
	}
}

func printOptions(options []string) {
	fmt.Println("Available options:")
	for i, option := range options {
		fmt.Printf("%d. %s\n", i+1, option)
	}
}
