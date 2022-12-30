BUILD_DIR=.build

run: clean dev dev-run-tests

dev:
	deno run --unstable -A index.ts
	ndisasm -b64 ${BUILD_DIR}/deno.bin

dev-run-tests:
	deno test --coverage=.build/.cov .

nasm-reference:
	nasm -fbin index.s -o ${BUILD_DIR}/index.bin
	ndisasm -b64 ${BUILD_DIR}/index.bin
	
clean:
	rm -rf ${BUILD_DIR}
	mkdir ${BUILD_DIR}
