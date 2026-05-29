module.exports = {
	content: [
	'./blocks/**/*.{js,jsx,ts,tsx,php}',
	'./inc/**/*.php',
	'./parts/**/*.{php,html}',
	'./resources/**/*.{js,jsx,ts,tsx}',
	'./templates/**/*.html',
	],
	theme: {
		extend: {},
	},
	plugins: [],
	safelist: [
	'.sr-only',
	'.sr-only!'
	]
};
