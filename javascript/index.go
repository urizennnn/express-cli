package javascript

import (
	"github.com/robertkrimen/otto"
)

func Test() {
	vm := otto.New()
	vm.Run(`
		console.log("Hello, World!");
	`)

}
