module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
		jest: true,
	},
	overrides: [
		{
			files: ['**/*.{ts,tsx}'],
			// Parser Settings
			// =================================
			// allow ESLint to understand TypeScript syntax
			// https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js#L10
			parser: '@typescript-eslint/parser',
			parserOptions: {
				// Lint with Type Information
				// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
				tsconfigRootDir: __dirname,
				project: './tsconfig.json',
			},
		}, {
			files: ['**/*.svelte'],
			processor: 'svelte3/svelte3',
		},
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:unicorn/recommended',
		'plugin:sonarjs/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
		'unicorn',
		'svelte3',
		'sonarjs',
	],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'comma-dangle': ['error', {
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'never',
			exports: 'never',
			functions: 'never',
		}],
		'no-unreachable-loop': 'error',
		'no-unsafe-optional-chaining': 'error',
		'require-atomic-updates': 'error',
		'array-callback-return': 'error',
		'no-caller': 'error',
		'no-multi-spaces': 'error',
		'no-param-reassign': 'error',
		'no-return-await': 'error',
		'radix': 'error',
		'require-await': 'error',
		'strict': 'error',
		'yoda': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'prefer-arrow-callback': 'error',
		'prefer-const': 'error',

		// Unicorn
		'unicorn/no-unsafe-regex': 'error',
		'unicorn/no-unused-properties': 'error',
		'unicorn/custom-error-definition': 'error',
		'unicorn/import-index': 'error',
		'unicorn/import-style': 'error',
		'unicorn/prefer-at': 'error',
		'unicorn/prefer-object-has-own': 'error',
		'unicorn/prefer-string-replace-all': 'error',
		'unicorn/string-content': 'error',

		'unicorn/prefer-node-protocol': 'off',
		'unicorn/prevent-abbreviations': 'off',
		'unicorn/filename-case': 'off',
		'unicorn/no-null': 'off',
		'unicorn/consistent-destructuring': 'off',
	},
}
