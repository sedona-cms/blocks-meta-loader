lint:
	npx eslint --fix '{src,scripts}/**/*.{js,ts,tsx}'

test:
	npx jest --color  --coverage

clear-all:
	rm -rf dist/
	rm -rf types/generated/

build: lint test clear-all
	npx tsc --project tsconfig.build.json
