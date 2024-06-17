import { AssignmentExpr, BinaryExpr, Identifier } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { interpreter } from "../interpreter.ts";
import { MK_NULL, NumberVal, RuntimeVal } from "../values.ts";

function evalNumericExpr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string,
): NumberVal {
  let result: number;

  switch (operator) {
    case "+":
      result = lhs.value + rhs.value;
      break;
    case "-":
      result = lhs.value - rhs.value;
      break;
    case "*":
      result = lhs.value * rhs.value;
      break;
    case "/":
      if (!+rhs.value) {
        throw `Invalid dividend: ${rhs.value}`;
      }
      result = lhs.value / rhs.value;
      break;
    case "%":
      result = lhs.value % rhs.value;
      break;

    default:
      throw 'Not valid numeric expression';
  }

  return { value: result, type: "number" };
}

export function evalBinaryExpr(binop: BinaryExpr, env: Environment): RuntimeVal {
  const lhs = interpreter(binop.left, env);
  const rhs = interpreter(binop.right, env);

  if (lhs.type === "number" && rhs.type === "number") {
    return evalNumericExpr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator,
    );
  }

  return MK_NULL();
}

export function evalIdentifier(ident: Identifier, env: Environment): RuntimeVal {
  return env.lookupVar(ident.symbol);
}

export function evalAssignment(
  node: AssignmentExpr,
  env: Environment,
): RuntimeVal {
  if (node.assigne.kind !== "Identifier") {
    throw `Invalid LHS inaide assignment expr ${JSON.stringify(node.assigne)}`;
  }

  const varName = (node.assigne as Identifier).symbol;
  return env.assignVar(varName, interpreter(node.value, env));
}
