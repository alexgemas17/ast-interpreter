import { Program, VarDeclaration } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { interpreter } from "../interpreter.ts";
import { MK_NULL, RuntimeVal } from "../values.ts";

export function evalProgram(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL();
  for (const statement of program.body) {
    lastEvaluated = interpreter(statement, env);
  }
  return lastEvaluated;
}

export function evalVarDeclaration(declaration: VarDeclaration, env: Environment): RuntimeVal {
  const value = declaration.value
    ? interpreter(declaration.value, env)
    : MK_NULL();

  return env.declareVar(declaration.identifier, value, declaration.constant);
}
