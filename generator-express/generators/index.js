const Generator = require('yeoman-generator');



module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('babel'); 
    }
   
}