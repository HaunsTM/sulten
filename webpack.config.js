const path = require('path');

module.exports = {
	devtool: 'inline-source-map',
	entry: './src/server/app.ts',
	module: {
		rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
			],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	watch: true,
	watchOptions: {
	  ignored: /node_modules/
	}
};