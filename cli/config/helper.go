package config

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/progress"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"path/filepath"
)

const (
	padding  = 2
	maxWidth = 80
)

var helpStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#626262")).Render

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

	fmt.Println("\x1b[32mConfig file successfully created!\x1b[0m")
}

func Spinner() {
	m := model{
		progress: progress.New(progress.WithDefaultGradient()),
	}

	if _, err := tea.NewProgram(m).Run(); err != nil {
		fmt.Println("Oh no!", err)
		os.Exit(1)
	}
}

type tickMsg time.Time

type model struct {
	progress progress.Model
}

func (m model) Init() tea.Cmd {
	return tickCmd()
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		return m, tea.Quit

	case tea.WindowSizeMsg:
		m.progress.Width = msg.Width - padding*2 - 4
		if m.progress.Width > maxWidth {
			m.progress.Width = maxWidth
		}
		return m, nil

	case tickMsg:
		if m.progress.Percent() == 1.0 {
			return m, tea.Quit
		}

		// Note that you can also use progress.Model.SetPercent to set the
		// percentage value explicitly, too.
		cmd := m.progress.IncrPercent(0.25)
		return m, tea.Batch(tickCmd(), cmd)

	// FrameMsg is sent when the progress bar wants to animate itself
	case progress.FrameMsg:
		progressModel, cmd := m.progress.Update(msg)
		m.progress = progressModel.(progress.Model)
		return m, cmd

	default:
		return m, nil
	}
}

func (m model) View() string {
	pad := strings.Repeat(" ", padding)
	return "\n" +
		pad + m.progress.View() + "\n\n" +
		pad + helpStyle("Press any key to quit")
}

func tickCmd() tea.Cmd {
	return tea.Tick(time.Second*1, func(t time.Time) tea.Msg {
		return tickMsg(t)
	})
}
