import path from "node:path";
import { init } from "./src/cli/cli-manager.ts";
import ASTParser from "./src/frontend/parser.ts";
import Environment, { initRootEnv } from "./src/runtime/environment.ts";
import { interpreter } from "./src/runtime/interpreter.ts";

(async function repl() {
  const parser = new ASTParser();

  // ------ Global Enviornment ------
  const env = new Environment();
  initRootEnv(env)

  const rootPath = path.resolve(__dirname)
  const input = await init(rootPath)
  if (!input) {
    process.exit(1);
  }

  const ast = parser.generateAST(input);

  const result = interpreter(ast, env);

  console.log(result);
})()
