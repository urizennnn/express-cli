import { installMSQL,installMongo,installPGSQL } from "../../process/injectDatabase";

export async function helperInject(database:string){
    if (database === "MongoDB") {
     await installMongo();
    } else if (database === "MSQL") {
    await  installMSQL();
    } else if (database === "PGSQL") {
     await installPGSQL();
    }
}