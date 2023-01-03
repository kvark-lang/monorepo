@preprocessor typescript
@builtin "whitespace.ne"
@builtin "number.ne"

Sourcefile -> (Statement):*

Statement -> IntegerDeclaration

IntegerDeclaration -> ("octet" __ alphanumeric _ "=" _ number
        | "word" __ alphanumeric _ "=" _ number
        | "dword" __ alphanumeric _ "=" _ number
        | "qword" __ alphanumeric _ "=" _ number
        | "oword" __ alphanumeric _ "=" _ number) {%
															    function(data) {
															    	const actual = data[0]
															        return {
															            type:  actual[0],
															            name:  actual[2].join().replace(/,/g, ""),
															            value: actual[6][0]
															        };
															    }
												   %}

number -> decimal | int
alphanumeric -> [a-zA-Z0-9]:+