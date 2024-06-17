import {
  AssignmentExpr,
  BinaryExpr,
  Expr,
  Identifier,
  NumericLiteral,
  Program,
  Stmt,
  VarDeclaration,
} from "./ast.ts";

import { Token, tokenize, TokenType } from "./lexer";


export default class ASTParser {
  private tokens: Token[] = [];

  public generateAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Parse until end of file
    while (!this.isEof()) {
      program.body.push(this.parseStmt());
    }

    return program;
  }

  /* -------- Private -------- */
  private isEof(): boolean {
    return this.tokens[0].type === TokenType.EOF;
  }

  private currentToken() {
    return this.tokens[0] as Token;
  }

  private advance() {
    return this.tokens.shift() as Token;
  }

  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type !== type) {
      console.error("Parser Error:\n", err, `{ value: '${prev.value}', type: ${TokenType[prev.type]} }`, " - Expecting: ", TokenType[type]);
      process.exit(1);
    }

    return prev;
  }

  private parseStmt(): Stmt {
    // skip to parse_expr
    switch (this.currentToken().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parseVarDeclaration();
      default:
        return this.parseExpr();
    }
  }

  private parseVarDeclaration(): Stmt {
    const isConstant = this.advance().type === TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expected identifier name following let | const keywords.",
    ).value;

    if (this.currentToken().type === TokenType.Semicolon) {
      this.advance(); // expect semicolon
      if (isConstant) {
        throw "Must assigne value to constant expression. No value provided.";
      }

      return {
        kind: "VarDeclaration",
        identifier,
        constant: false,
      } as VarDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Expected equals token following identifier in var declaration.",
    );

    const declaration = {
      kind: "VarDeclaration",
      value: this.parseExpr(),
      identifier,
      constant: isConstant,
    } as VarDeclaration;

    this.expect(
      TokenType.Semicolon,
      "Variable declaration statment must end with semicolon.",
    );

    return declaration;
  }

  private parseExpr(): Expr {
    return this.parseAssignmentExpr();
  }

  private parseAssignmentExpr(): Expr {
    const left = this.parseAddExpr();

    if (this.currentToken().type === TokenType.Equals) {
      this.advance();
      const value = this.parseAssignmentExpr();
      return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }

    return left;
  }

  private parseAddExpr(): Expr {
    let left = this.parseMultExpr();

    while (this.currentToken().value === "+" || this.currentToken().value === "-") {
      const operator = this.advance().value;
      const right = this.parseMultExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parseMultExpr(): Expr {
    let left = this.parsePrimaryExpr();

    while (
      this.currentToken().value === "/" || this.currentToken().value === "*" || this.currentToken().value === "%"
    ) {
      const operator = this.advance().value;
      const right = this.parsePrimaryExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parsePrimaryExpr(): Expr {
    const tk = this.currentToken().type;

    // Determine which token we are currently at and return literal value
    switch (tk) {
      // User defined values.
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.advance().value } as Identifier;

      // Constants and Numeric Constants
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.advance().value),
        } as NumericLiteral;

      // Grouping Expressions
      case TokenType.OpenParen: {
        this.advance(); // eat the opening paren
        const value = this.parseExpr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
        ); // closing paren
        return value;
      }

      // Unidentified Tokens and Invalid Code Reached
      default:
        console.error("Unexpected token found during parsing!", this.currentToken());
        process.exit(1);
    }
  }
}
