import path from 'node:path';
import fs from 'node:fs'
import util from 'util'

export const readFile = (rootPath: string, fileName: string) => util.promisify(fs.readFile)(path.join(rootPath, fileName), 'utf8');
