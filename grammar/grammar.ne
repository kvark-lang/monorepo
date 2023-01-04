@preprocessor typescript
@builtin "whitespace.ne"
@builtin "number.ne"

Sourcefile -> (Statement):*

Statement -> ImportPackage | IntegerDeclaration | FloatDeclaration | BinaryDeclaration | BooleanDeclaration

ImportPackage -> ("import" __ alphanumeric __ "from" __ alphanumeric) {%
															    function(data) {
															    	const actual = data[0]
															        return {
															            type:  actual[0],
															            name:  actual[2].join().replace(/,/g, ""),
															            value: actual[6][0] == "true" ? true : false
															        };
															    }
												   			%}

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

FloatDeclaration -> ("half" __ alphanumeric _ "=" _ number
		| "float" __ alphanumeric _ "=" _ number
		| "double" __ alphanumeric _ "=" _ number
		| "extp" __ alphanumeric _ "=" _ number
		| "quad" __ alphanumeric _ "=" _ number) {%
															    function(data) {
															    	const actual = data[0]
															        return {
															            type:  actual[0],
															            name:  actual[2].join().replace(/,/g, ""),
															            value: actual[6][0]
															        };
															    }
												   %}

BinaryDeclaration -> ("byte" __ alphanumeric _ "=" _ number
		| "bit" __ alphanumeric _ "=" _ number) {%
															    function(data) {
															    	const actual = data[0]
															        return {
															            type:  actual[0],
															            name:  actual[2].join().replace(/,/g, ""),
															            value: actual[6][0]
															        };
															    }
												   %}

BooleanDeclaration -> ("bool" __ alphanumeric _ "=" _ boolean) {%
															    function(data) {
															    	const actual = data[0]
															        return {
															            type:  actual[0],
															            name:  actual[2].join().replace(/,/g, ""),
															            value: actual[6][0] == "true" ? true : false
															        };
															    }
												   %}


number -> decimal | int
alphanumeric -> [a-zA-Z0-9]:+
boolean -> "true" | "false"