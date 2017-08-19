const ExtractText = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack').IgnorePlugin;

module.exports = {
    watch: true,
    target: 'electron',
    entry: './app/app.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'stage-2']
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractText.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100'
            }
        ]
    },
    plugins: [
        new ExtractText('styles.css'),
        new IgnorePlugin(/regenerator|nodent|js\-beautify/, /ajv/)
    ]
};