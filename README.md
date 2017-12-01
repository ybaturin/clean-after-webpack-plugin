# clean-after-webpack-plugin
The Webpack's config allow to set output assets names, which can contain hash in the name (for cache invalidation).<br />
But it makes a small annoying problem: files which was created in previous build process will stay on hard disk until you decided to remove them manually.<br />
Current Webpack plugin solves this problem.

## Installation
```
npm i clean-after-webpack-plugin --save-dev
```

## Usage
```js
const CleanAfterWebpackPlugin = require('clean-after-webpack-plugin')

// webpack config
{
  plugins: [
    new CleanAfterWebpackPlugin([{options}])
  ]
}
```


### Options and defaults (Optional)
```js
{
  // filenames which we don't want to remove
  exceptFiles: [ 'dontDeleteThisFile.txt', 'importantScript.js' ],

  // enable/disable this plugin (eg: for webpack-dev-server we don't want to remove files from build foder)
  // Default: false
  disabled: true
}
```
