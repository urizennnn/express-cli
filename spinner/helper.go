package spinner

import (
// "fmt"
// "math/rand"
)

var Packages = []string{}

func getPackages() []string {
	pkgs := Packages
	copy(pkgs, Packages)

	return pkgs
}
