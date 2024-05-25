package config

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/urizennnn/express-cli/process"
)

var quitTextStyle = lipgloss.NewStyle().Margin(1, 0, 2, 4)

type errMsg error

type model struct {
	spinner  spinner.Model
	quitting bool
	err      error
}

func initialModel() model {
	s := spinner.New()
	s.Spinner = spinner.Line
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color("205"))
	return model{spinner: s}
}

func (m model) Init() tea.Cmd {
	return m.spinner.Tick
}

func (m model) Update(message tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := message.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "esc", "ctrl+c":
			m.quitting = true
			return m, tea.Quit
		default:
			return m, nil
		}

	case errMsg:
		m.err = msg

		return m, nil

	case spinner.TickMsg:
		var cmd tea.Cmd

		m.spinner, cmd = m.spinner.Update(msg)

		return m, cmd

	default:
		return m, nil
	}

}

func (m model) View() string {
	if m.err != nil {
		return m.err.Error()
	}

	str := fmt.Sprintf("%s Compiling...\n", m.spinner.View())

	if m.quitting {
		os.Exit(1)
	}
	return str
}

func Run(cwd, DirName, language string) int {
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		defer wg.Done()
		defer cancel()

		process.CopyFilesToCWD(cwd, DirName, language, cancel)
		select {
		case <-ctx.Done():
			return
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		defer cancel()

		p := tea.NewProgram(initialModel(), tea.WithContext(ctx), tea.WithoutSignalHandler())

		_, err := p.Run()
		if err != nil && !errors.Is(err, tea.ErrProgramKilled) {
			panic(err)
		}
	}()

	wg.Wait()

	fmt.Println(Green + "Express application created successfully!" + Green)
	return 0
}

func CreateFolderAndWriteConfig(preferences User) {
	userProfile, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("\x1b[31;4mUnable to determine user profile directory.\x1b[0m")
		return
	}

	folderPath := filepath.Join(userProfile, ".express-cli")
	filePath := filepath.Join(folderPath, ".express.config.json")

	err = os.MkdirAll(folderPath, 0755)
	if err != nil {
		fmt.Printf("\x1b[31;4mError creating folder: %v\x1b[0m\n", err)
		return
	}

	file, err := os.Create(filePath)
	if err != nil {
		fmt.Printf("\x1b[31;4mError creating file: %v\x1b[0m\n", err)
		return
	}
	defer file.Close()

	jsonData, err := json.MarshalIndent(preferences, "", "    ")
	if err != nil {
		fmt.Printf("\x1b[31;4mError marshaling JSON: %v\x1b[0m\n", err)
		return
	}

	_, err = file.Write(jsonData)
	if err != nil {
		fmt.Printf("\x1b[31;4mError writing to file: %v\x1b[0m\n", err)
		return
	}

}
