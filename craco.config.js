const CracoAlias = require("craco-alias");

module.exports = {
	plugins: [
		{
			plugin: {
				overrideWebpackConfig: ({ webpackConfig }) => {
					if (webpackConfig?.module?.rules && Array.isArray(webpackConfig.module.rules)) {
						webpackConfig.module.rules.push({
							test: /\.mjs$/,
							include: /node_modules/,
							type: "javascript/auto",
						});
					}

					return webpackConfig;
				},
			},
		},
		{
			plugin: CracoAlias,
			options: {
				source: "tsconfig",
				baseUrl: "./src",
				tsConfigPath: "./tsconfig.paths.json",
			},
		},
	],
};
