function minCode({src = '', dest = ''}) {
  const UglifyJS = require("uglify-js");
  const fs = require("fs");
  const code = fs.readFileSync(src, 'utf-8')
  const result = UglifyJS.minify(code);
  fs.writeFileSync(dest, result.code)
}

minCode({src: `dist/es/index.js`, dest: `dist/es/index.min.js`})
minCode({src: `dist/index.js`, dest: `dist/index.min.js`})