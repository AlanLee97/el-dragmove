const fsExtra = require('fs-extra')

async function fileOp(ops = 'move', files) {
  const targets = Array.isArray(files) ? files : [files]
  let flag
  for (const target of targets) {
    await fsExtra[ops](target.src, target.dest, {
      overwrite: (flag = target.overwrite) !== null && flag !== undefined ? flag : overwrite
    })
  }
}

fileOp('move', [{ src: `dist/index.es.js`, dest: `dist/es/index.js`, overwrite: true }])
fileOp('copy', [{ src: `lib/index.js`, dest: `dist/index.js`, overwrite: true }])