// Load environment variables
require('dotenv').config();

// WordPress default config
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// Plugins
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Node utilities
const path = require('path');
const glob = require('glob');

//Normalizing path
const normalizePath = (p) => p.replace(/\\/g, '/');

// Site URL from .env or fallback
const siteUrl = process.env.SITE_URL || 'http://localhost';

// Define entries
const entry = {
  'js/editor': [
    path.resolve(__dirname, 'resources/js/editor.js'),
    ...glob.sync('./blocks/**/index.{js,jsx,ts,tsx}').map(normalizePath),
  ],
  'css/editor': path.resolve(__dirname, 'resources/css/editor.css'),
  'js/admin': [
    path.resolve(__dirname, 'resources/js/admin.js'),
  ],
  'css/admin': path.resolve(__dirname, 'resources/css/admin.css'),
  'js/screen': [
    path.resolve(__dirname, 'resources/js/screen.js'),
    ...glob.sync('./blocks/**/!(*index).js').map(normalizePath),
  ],
  'css/screen': [
    path.resolve(__dirname, 'resources/css/screen.css'),
    ...glob.sync('./blocks/**/*.css').map(normalizePath),
  ],
};

module.exports = {
  ...defaultConfig,
  entry,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  stats: 'errors-warnings',
  plugins: [
    ...defaultConfig.plugins,

    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),

    new RemoveEmptyScriptsPlugin({
      stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
    }),

    new BrowserSyncPlugin(
      {
        proxy: siteUrl,
        files: [
          '**/*.php',
          '!public/**/*.asset.php',
          '!public/**/*.map',
          'public/**/*.css',
          'public/**/*.js',
        ],
        open: false,
        injectChanges: true,
        notify: false,
        reloadDelay: 0,
        reloadDebounce: 200,
      },
      { reload: true }
    ),

    ...(glob.sync('./blocks/**/resources')?.length ? [
      new CopyWebpackPlugin({
        patterns: glob.sync('./blocks/**/resources').map((folder) => {
          folder = normalizePath(folder);
          const relativePath = path.relative('./blocks', path.dirname(folder));
          return {
            from: folder,
            to: path.resolve(__dirname, `public/blocks/${relativePath}`),
            noErrorOnMissing: true,
          };
        }),
      })
    ] : [] ),
  ],
  module: {
    rules: [
      {
        test: /\.svg$/,     
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              exportType: 'named',
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.(woff2?|ttf|otf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      }
    ],
  },
  resolve: {
    extensions: [
      '.tsx',
      '.jsx',
      '.ts',
      '.js',
    ],
    alias: {
      blocks: path.resolve(__dirname, 'blocks'),
      parts: path.resolve(__dirname, 'parts'),
      resources: path.resolve(__dirname, 'resources'),
    },
  },

};
