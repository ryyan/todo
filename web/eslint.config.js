import svelte from 'eslint-plugin-svelte';
import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
		}
	}
];
