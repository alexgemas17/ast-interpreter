import { Token, TokenType } from "./types";

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
};

function token(value: string = "", type: TokenType): Token {
  return { value, type } as Token;
}

function at(source: string[]) {
  return source[0];
}

function isKeyword(src: string) {
  return src.toUpperCase() !== src.toLowerCase();
}

function isNumber(str: string) {
  return !isNaN(+str);
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  while (src.length > 0) {
    switch (at(src)) {
      case '(':
        tokens.push(token(src.shift(), TokenType.OpenParen));
        continue;

      case ')':
        tokens.push(token(src.shift(), TokenType.CloseParen));
        continue;

      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        tokens.push(token(src.shift(), TokenType.BinaryOperator));
        continue;

      case '=':
        tokens.push(token(src.shift(), TokenType.Equals));
        continue;

      case ';':
        tokens.push(token(src.shift(), TokenType.Semicolon));
        continue;

      case '=':
        tokens.push(token(src.shift(), TokenType.Equals));
        continue;

      case ' ':
      case '\n':
      case '\t':
        src.shift();
        continue;
    }

    if (isNumber(at(src))) {
      let num = "";
      while (src.length > 0 && isNumber(at(src))) {
        num += src.shift();
      }

      // append new numeric token.
      tokens.push(token(num, TokenType.Number));
    }
    else if (isKeyword(at(src))) {
      let ident = "";
      while (src.length > 0 && isKeyword(at(src))) {
        ident += src.shift();
      }

      const reserved = KEYWORDS[ident];
      if (typeof reserved === "number") {
        tokens.push(token(ident, reserved));
      } else {
        tokens.push(token(ident, TokenType.Identifier));
      }
    }
    else {
      console.error(
        "Unreconized character found in source: ",
        at(src).charCodeAt(0),
        at(src),
      );

      process.exit(1);
    }
  }

  tokens.push({ value: "EndOfFile", type: TokenType.EOF } as Token);

  return tokens;
}
