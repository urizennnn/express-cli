package cli

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/charmbracelet/bubbles/list"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	config "github.com/urizennnn/express-cli/functions/config"
)

const listHeight = 14

var (
	Preferences = config.User{
		PackageManager: "",
		Language:       "",
	}
	number            = 0
	titleStyle        = lipgloss.NewStyle().MarginLeft(2)
	itemStyle         = lipgloss.NewStyle().PaddingLeft(4)
	selectedItemStyle = lipgloss.NewStyle().PaddingLeft(2).Foreground(lipgloss.Color("170"))
	paginationStyle   = list.DefaultStyles().PaginationStyle.PaddingLeft(4)
	helpStyle         = list.DefaultStyles().HelpStyle.PaddingLeft(4).PaddingBottom(1)
	quitTextStyle     = lipgloss.NewStyle().Margin(1, 0, 2, 4)
)

type item string

func (i item) FilterValue() string { return "" }

type itemDelegate struct{}

func (d itemDelegate) Height() int                             { return 1 }
func (d itemDelegate) Spacing() int                            { return 0 }
func (d itemDelegate) Update(_ tea.Msg, _ *list.Model) tea.Cmd { return nil }
func (d itemDelegate) Render(w io.Writer, m list.Model, index int, listItem list.Item) {
	i, ok := listItem.(item)
	if !ok {
		return
	}

	str := fmt.Sprintf("%d. %s", index+1, i)

	fn := itemStyle.Render
	if index == m.Index() {
		fn = func(s ...string) string {
			return selectedItemStyle.Render("> " + strings.Join(s, " "))
		}
	}

	fmt.Fprint(w, fn(str))
}

type Model struct {
	list     list.Model
	choice   string
	quitting bool
}

func (m Model) Init() tea.Cmd {
	return nil
}

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.list.SetWidth(msg.Width)
		return m, nil

	case tea.KeyMsg:
		switch keypress := msg.String(); keypress {
		case "q", "ctrl+c":
			m.quitting = true
			return m, tea.Quit

		case "enter":
			i, ok := m.list.SelectedItem().(item)
			if ok {
				m.choice = string(i)
				m.input_Preferences(m.choice)
				number++
				if number < len(UpdateTitleArray()) {
					List()
				} else {
					config.CreateFolderAndWriteConfig(Preferences)
					return m, tea.Quit
				}
			} else {
				number++
				if number < len(UpdateTitleArray()) {
					List()
				} else {
					config.CreateFolderAndWriteConfig(Preferences)
					return m, tea.Quit
				}
			}
		}
	}

	var cmd tea.Cmd
	m.list, cmd = m.list.Update(msg)
	return m, cmd
}

func (m Model) View() string {
	if m.choice != "" {
		return quitTextStyle.Render("")
	}
	if m.quitting {
		return quitTextStyle.Render("Turning off generators...")
	}
	return "\n" + m.list.View()
}

func List() {
	if number == len(UpdateTitleArray()) {
		return
	}

	items := UpdateList()
	if items == nil {
		return

	}
	const defaultWidth = 20

	l := list.New(items, itemDelegate{}, defaultWidth, listHeight)
	title, _ := UpdateTitle()
	l.Title = title
	l.SetShowStatusBar(false)
	l.SetFilteringEnabled(false)
	l.Styles.Title = titleStyle
	l.Styles.PaginationStyle = paginationStyle
	l.Styles.HelpStyle = helpStyle

	m := Model{list: l}
	if _, err := tea.NewProgram(m).Run(); err != nil {
		fmt.Println("Error running program:", err)
		os.Exit(1)
	}
}

func UpdateTitle() (string, int) {
	title := UpdateTitleArray()
	length := len(title)
	if number >= 0 && number < length {
		return title[number], length
	}
	return "", length
}

func UpdateTitleArray() []string {
	return []string{"What package Manager do you want to use", "What language would you like to use"}
}

func UpdateList() []list.Item {
	lists_0 := []list.Item{
		item("npm"),
		item("yarn"),
		item("pnpm"),
	}

	lists_1 := []list.Item{
		item("JavaScript"),
		item("TypeScript"),
	}

	switch number {
	case 0:
		return lists_0
	case 1:
		return lists_1
	default:
		return nil
	}
}

func Skip() config.User {
	home, err := os.UserHomeDir()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	path := home + "/.express-cli/.express.config.json"

	contents, err := os.ReadFile(path)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	var lines config.User
	json.Unmarshal(contents, &lines)
	return lines
}

func (m Model) input_Preferences(i string) {
	switch number {
	case 0:
		Preferences.PackageManager = i
	case 1:
		Preferences.Language = i
	}
}
