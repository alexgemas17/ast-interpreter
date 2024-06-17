import { NumberVal, RuntimeVal } from "./values.ts";
import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  Program,
  Stmt,
  VarDeclaration,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { evalProgram, evalVarDeclaration } from "./eval/statements.ts";
import {
  evalAssignment,
  evalBinaryExpr,
  evalIdentifier,
} from "./eval/expressions.ts";

export function interpreter(astNode: Stmt, env: Environment): RuntimeVal {
  try {
    switch (astNode.kind) {
      case "NumericLiteral":
        return {
          value: ((astNode as NumericLiteral).value),
          type: "number",
        } as NumberVal;
      case "Identifier":
        return evalIdentifier(astNode as Identifier, env);
      case "AssignmentExpr":
        return evalAssignment(astNode as AssignmentExpr, env);
      case "BinaryExpr":
        return evalBinaryExpr(astNode as BinaryExpr, env);
      case "Program":
        return evalProgram(astNode as Program, env);
      case "VarDeclaration":
        return evalVarDeclaration(astNode as VarDeclaration, env);
      default:
        console.error(
          "This AST Node has not yet been setup for interpretation.",
          astNode,
        );

        process.exit(0);
    }
  } catch (error) {
    console.error("Interpreter Error:\n", error);
    process.exit(1);
  }
}
