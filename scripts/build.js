const rollup = require('rollup');
const configFile = require('../rollup.config.js');

async function build(config) {
  const bundle = await rollup.rollup(config);
  await bundle.write(config.output);
}

const configList = Array.isArray(configFile) ? configFile : [configFile];

configList.forEach((config) => {
  build(config);
});
