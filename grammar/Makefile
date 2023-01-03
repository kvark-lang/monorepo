BUILD_DIR=.build

run: clean dev-run-tests

dev:
	deno run -A npm:nearley/nearleyc grammar.ne -o ${BUILD_DIR}/parser.ts
	
dev-run-tests: dev
	deno test --coverage=.build/.cov .
	
railroad:
	deno run -A npm:nearley/nearley-railroad grammar.ne -o ${BUILD_DIR}/railroad.html
	
clean:
	rm -rf ${BUILD_DIR}
	mkdir ${BUILD_DIR}
