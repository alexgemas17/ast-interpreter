export enum TokenType {
    Number,
    Identifier,

    // Keywords
    Let,
    Const,

    BinaryOperator,
    Equals,
    Semicolon,
    OpenParen,
    CloseParen,
    EOF, // End of file
}


export interface Token {
    value: string;
    type: TokenType;
}