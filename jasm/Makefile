#!/usr/bin/env make
ROOT_DIR=$(shell pwd)
BUILD_DIR=${ROOT_DIR}/.build

run: clean nasm-tests jasm-tests

jasm-tests:
	deno test --coverage=.build/.cov --allow-read .

nasm-tests: mov inc add

mov:
	nasm -felf32 ${ROOT_DIR}/test/$@.asm -o ${BUILD_DIR}/$@.bin
	objcopy -O binary -j .firstTest ${BUILD_DIR}/$@.bin ${BUILD_DIR}/$@.rr.bin
	objcopy -O binary -j .secondTest ${BUILD_DIR}/$@.bin ${BUILD_DIR}/$@.ri.bin

add:
	nasm -felf64 ${ROOT_DIR}/test/$@.asm -o ${BUILD_DIR}/$@.bin
	objcopy -O binary -j .firstTest ${BUILD_DIR}/$@.bin ${BUILD_DIR}/$@.rr.bin
	objcopy -O binary -j .secondTest ${BUILD_DIR}/$@.bin ${BUILD_DIR}/$@.ri.bin
	objcopy -O binary -j .thirdTest ${BUILD_DIR}/$@.bin ${BUILD_DIR}/$@.bri.bin

inc:
	nasm -felf32 ${ROOT_DIR}/test/$@.asm -o ${BUILD_DIR}/$@.bin
	objcopy -O binary -j .firstTest ${BUILD_DIR}/$@.bin ${BUILD_DIR}/$@.na.bin

clean:
	rm -rf ${BUILD_DIR}
	mkdir ${BUILD_DIR}
