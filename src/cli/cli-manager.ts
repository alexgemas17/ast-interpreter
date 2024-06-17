import { readFile } from './loader'

type CliArgvs = {
    fileName: string
}

function getArgvs(): CliArgvs {
    if (process.argv.length < 2) {
        process.exit(1);
    }

    var args = process.argv.slice(2);
    return {
        fileName: args[0]
    }
}

export async function init(rootPath: string): Promise<string> {
    const argvs = getArgvs()

    return await readFile(rootPath, argvs.fileName)
}