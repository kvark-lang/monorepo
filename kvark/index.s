; Define variables in the data section
SECTION .DATA
	hello:     db 'Hello world!',10
	helloLen:  equ $-hello

section .text

	mov eax,3            ; 'write' system call = 4
	mov ebx,2            ; file descriptor 1 = STDOUT
	mov ecx,[hello]        ; string to write
	mov edx,5     ; length of string to write
	int 80h              ; call the kernel

	mov eax,4            ; 'write' system call = 4
	mov ebx,1            ; file descriptor 1 = STDOUT
	mov ecx,hello        ; string to write
	mov edx,helloLen     ; length of string to write
	int 80h              ; call the kernel

	; Terminate program
	mov eax,1            ; 'exit' system call
	mov ebx,0            ; exit with error code 0
	int 80h              ; call the kernel
