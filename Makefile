DOC = jsdoc
all:
	browserify . -s BFCPLib -o bfcp-lib.js

doc:
	$(DOC) index.js lib --readme ./README.md -r -d docs

