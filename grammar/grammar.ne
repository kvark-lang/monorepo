@preprocessor typescript
@builtin "whitespace.ne"
@builtin "number.ne"

statement -> intDeclaration:+

intDeclaration -> "octet" _ alphanumeric _ "=" _ number semicolon
        | "word" _ alphanumeric _ "=" _ number semicolon
        | "dword" _ alphanumeric _ "=" _ number semicolon
        | "qword" _ alphanumeric _ "=" _ number semicolon
        | "oword" _ alphanumeric _ "=" _ number semicolon

number -> decimal | int
semicolon -> ";"
alphanumeric -> [a-zA-Z0-9]:+