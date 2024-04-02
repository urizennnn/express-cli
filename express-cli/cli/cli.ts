import { prompt,initArgs,args } from "../config/cli.config";


  const question =  [
    {
    type:'list',
    name:'package',
    message:'Choose package manager',
    choices:['npm','yarn','pnpm'],
    default:'npm',
    },
    {
    type:'list',
    name:'language',
    message:'Choose language',
    choices:['JavaScript','TypeScript'],
    default:'JavaScript',
    },
    {
        type:'list',
        name:'dependency',
        message:'Would you like to add pre installed dependencies or a fresh start?',
        choices:['pre installed','fresh start'],
        default:'pre installed',
    }

   ]

function createExpress() {
    prompt(question).then((answer) => {
        console.log(answer)
    })
}
initArgs().then((args) => {
    if (args._ && args._[0] === 'create') {
        createExpress();
    }
});
