NODE ?= node

test:
	$(NODE) ./node_modules/.bin/eslint src/

build:
	$(NODE) ./node_modules/.bin/babel -d ./dist/ ./src

.PHONY: test build
