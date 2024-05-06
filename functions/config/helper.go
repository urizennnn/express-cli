package config

import (
	"encoding/json"
	"fmt"
	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"os"
	"path/filepath"
)

var (
	// Available spinners
	spinners = []spinner.Spinner{
		spinner.Line,
		spinner.Dot,
		spinner.MiniDot,
		spinner.Jump,
		spinner.Pulse,
		spinner.Points,
		spinner.Globe,
		spinner.Moon,
		spinner.Monkey,
	}

	textStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("252")).Render
	spinnerStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("69"))
	helpStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("241")).Render
)

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

func Spinner() {
	m := model{}
	m.resetSpinner()

	if _, err := tea.NewProgram(m).Run(); err != nil {
		fmt.Println("could not run program:", err)
		os.Exit(1)
	}
}

type model struct {
	index   int
	spinner spinner.Model
}

func (m model) Init() tea.Cmd {
	return m.spinner.Tick
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q", "esc":
			return m, tea.Quit
		case "h", "left":
			m.index--
			if m.index < 0 {
				m.index = len(spinners) - 1
			}
			m.resetSpinner()
			return m, m.spinner.Tick
		case "l", "right":
			m.index++
			if m.index >= len(spinners) {
				m.index = 0
			}
			m.resetSpinner()
			return m, m.spinner.Tick
		default:
			return m, nil
		}
	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	default:
		return m, nil
	}
}

func (m *model) resetSpinner() {
	m.spinner = spinner.New()
	m.spinner.Style = spinnerStyle
	m.spinner.Spinner = spinners[m.index]
}

func (m model) View() (s string) {
	var gap string
	switch m.index {
	case 1:
		gap = ""
	default:
		gap = " "
	}

	s += fmt.Sprintf("\n %s%s%s\n\n", m.spinner.View(), gap, textStyle("Compiling..."))
	s += helpStyle("h/l, ←/→: change spinner • q: exit\n")
	return
}
