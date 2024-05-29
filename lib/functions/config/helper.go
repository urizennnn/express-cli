package config

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	Err "github.com/urizennnn/express-cli/errors"
	"github.com/urizennnn/express-cli/lib/process"
	"golang.org/x/term"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
	"time"
)

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

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		if msg.String() == "q" || msg.String() == "esc" || msg.String() == "ctrl+c" {
			m.quitting = true
			return m, tea.Quit
		}
	case errMsg:
		m.err = msg
	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	}
	return m, nil
}

func (m model) View() string {
	if m.err != nil {
		return m.err.Error()
	}
	if m.quitting {
		os.Exit(1)
	}
	return fmt.Sprintf("%s Compiling...\n", m.spinner.View())
}

func Run(cwd, DirName, manager, language string) int {
	start := time.Now()
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		defer cancel()
		err := process.CopyFilesToCWD(cwd, DirName, manager, language, cancel)
		Err.Check_Err(err)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		defer cancel()
		p := tea.NewProgram(initialModel(), tea.WithContext(ctx), tea.WithoutSignalHandler())
		if _, err := p.Run(); err != nil && !errors.Is(err, tea.ErrProgramKilled) {
			panic(err)
		}
	}()

	wg.Wait()
	end := time.Now()
	duration := end.Sub(start)
	finalDuration := duration.Truncate(time.Second)
	fmt.Println(Green + "Express application created successfully!" + Reset)
	fmt.Printf("✨ Operation took  %v\n", finalDuration)
	instructionsToRun(DirName)
	writeToTerm()
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

	if err = os.MkdirAll(folderPath, 0755); err != nil {
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

	if _, err = file.Write(jsonData); err != nil {
		fmt.Printf("\x1b[31;4mError writing to file: %v\x1b[0m\n", err)
	}
}

func writeToTerm() {
	str := "Thank you for using Express CLI! \nPlease don't forget to star the repository on GitHub! \nReach out to us on the issues page if you have any questions or suggestions. \nEnjoy your prebuilt Express application!"

	width, _, err := term.GetSize(int(os.Stdout.Fd()))
	if err != nil {
		fmt.Println("Error getting terminal size:", err)
		return
	}

	lines := strings.Split(str, "\n")
	for _, line := range lines {
		padding := (width - len(line)) / 2
		paddedLine := strings.Repeat(" ", padding) + line
		fmt.Println(Yellow + paddedLine + Reset)
	}
}

func instructionsToRun(packageName string) {
	fmt.Printf(Grey+" $  cd %s\n"+Reset, packageName)
	fmt.Println(Grey + " $  npm start" + Reset)
}
