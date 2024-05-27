package config

type User struct {
	PackageManager string `json:"packageManager"`
	Language       string `json:"language"`
}

var Preferences = User{
	PackageManager: "",
	Language:       "",
}
