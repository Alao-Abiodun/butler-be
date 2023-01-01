/* eslint-disable import/no-extraneous-dependencies */
const cmd = require('commander');
const Joi = require('joi');
const j2s = require('joi-to-swagger');
const m2s = require('mongoose-to-swagger');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const YAML = require('json-to-pretty-yaml');

cmd
//   .option('-v, --verbose', 'Be verbose')
  .option('-j, --joi <file_name>', 'Path to Joi Schema folder')
  .option('-m, --mongoose <file_name>', 'Path to Mongoose file')
  .action(main);

// cmd
//   .command('generate')
//   .alias('g')
//   .description('Converts input file to output file')
//   .option('-j, --joi <file_name>', 'Path to Joi Schema folder')
//   .option('-m, --mongoose <file_name>', 'Path to Mongoose file')
//   .action(main);

cmd.parse(process.argv);
// if (!cmd.args.length) cmd.help();

// function doConvert(cmd) {
//   // do something with cmd.inFile and cmd.outFile
// }

// const data =
// console.log(data);

function JoiSchemaToYAML(JoiSchema) {
  return j2s(JoiSchema, {}).swagger;
}

function JSONSchema2YAML(JSONSchema) {
  return YAML.stringify(JSONSchema);
}

function saveYAMLOut(name, data, callback) {
  const saveTo = path.join(__dirname, '..', 'generatedData', `${name}.yaml`);
  fs.writeFile(saveTo, data, callback);
}

function main() {
  if (cmd.joi) {
    try {
      // eslint-disable-next-line global-require
      const h = require(path.resolve(cmd.joi));
      console.log(h.as);
    } catch (error) {
      console.log(error);
      throw new Error('Cannot import file');
    }
  } else if (cmd.mongoose) {
    // eslint-disable-next-line global-require
    const h = require(path.resolve(cmd.mongoose));
    Object.keys(h).forEach((x) => {
      if (h[x].prototype instanceof mongoose.Model) {
        const openAPI = JSONSchema2YAML(m2s(h[x]));
        saveYAMLOut(x, openAPI, (err, result) => {
          if (err) throw err;
          console.log('DONE');
          return 'DONE';
        });
      }
    });
    return 'asa';
  }
}
// const a = JoiSchemaToYAML(schema);

// console.log(a);

// saveYAMLOut('ttt', jsonToYAML(a), (err, res) => {
//   console.log(res);
//   console.log(err);
// });
// console.log(path.resolve('../generatedData'));
