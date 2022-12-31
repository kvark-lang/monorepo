ROOT_DIR=$(shell pwd)
BUILD_DIR=${ROOT_DIR}/.build

run: clean santa-test

santa-test:
	deno test --coverage=.build/.cov --allow-read .

clean:
	rm -rf ${BUILD_DIR}
	mkdir ${BUILD_DIR}