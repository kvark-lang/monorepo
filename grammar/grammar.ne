@preprocessor typescript
@builtin "whitespace.ne"
@builtin "number.ne"

statement -> intDeclaration:+

intDeclaration -> "octet" __ alphanumeric _ "=" _ number semicolon
        | "word" __ alphanumeric _ "=" _ number semicolon
        | "dword" __ alphanumeric _ "=" _ number semicolon
        | "qword" __ alphanumeric _ "=" _ number semicolon
        | "oword" __ alphanumeric _ "=" _ number semicolon

number -> decimal | int
semicolon -> ";"
alphanumeric -> [a-zA-Z0-9]:+