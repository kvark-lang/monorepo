@preprocessor typescript

@builtin "whitespace.ne"
@builtin "number.ne"
@builtin "string.ne"

Sourcefile -> (Statement):*

Statement -> ImportPackage 
				| Comment 
				| Declaration


ImportPackage -> ("import" _ (Identifier) _ "from" __ "\"" Identifier "\""
		| "import" _ "{" _ (Identifier | (Identifier _ ("," _ Identifier):*)) _ "}" _ "from" __ "\"" Identifier "\""
		| "import" _ "{" _ (Identifier) _ "}" _ "from" __ "\"" Identifier "\"")

Comment -> "#" .:+ "\n"

Declaration -> Identifier __ Identifier _ "=" _ Value ";" {%
	function(data) {
		return {
			type: data[0],
			name: data[2],
			value: data[6][0]
		}
	}
%}

Value -> (Number | String | Boolean) {%
	function(data) {
		return data[0][0] 
	}
%}
String -> sqstring | dqstring
Number -> (decimal | int) {%
	function(data) {
		return data[0]
	}
%}
Identifier -> [a-zA-Z0-9_]:+ {%
	function(data) {
		return data[0].join("")
	}
%}
Boolean -> ("true" | "false") {%
	function(data) {
		const Lookup = {
			"true": true,
			"false": false
		} as Record<string, boolean>
		return [Lookup[data[0]]]
	}
%}