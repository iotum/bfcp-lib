DOC = jsdoc
all:
	npm run build

doc:
	$(DOC) index.js lib --readme ./README.md -r -d docs

