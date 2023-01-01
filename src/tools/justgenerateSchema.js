/* eslint-disable import/no-extraneous-dependencies */
const cmd = require('commander');
const Joi = require('joi');
const j2s = require('joi-to-swagger');
const m2s = require('mongoose-to-swagger');
const fs = require('fs');
const path = require('path');
const YAML = require('json-to-pretty-yaml');
const {
  USER_ROLES, USER_STATUS,
} = require('../utils/constants');

const userRules = require('../validators/user.rules');

const requiredString = Joi.string().required();
const requiredNumber = Joi.number().required();

function JoiSchemaToOpenAPI(JoiSchema) {
  return j2s(JoiSchema, {}).swagger;
}

function JSONSchema2YAML(JSONSchema) {
  return YAML.stringify(JSONSchema);
}

function saveYAMLOut(name, data, callback) {
  const saveTo = path.join(__dirname, '..', 'generatedData', `${name}.yaml`);
  fs.writeFile(saveTo, data, callback);
}

function main(name) {
  const a = JoiSchemaToOpenAPI(userRules.createUserSchema);
  const x = JSONSchema2YAML(a);
  saveYAMLOut(name, x, (err, result) => {
    if (err) throw err;
    console.log('DOne');
  });
}
main('createUserSchema');

// function main2(name) {

// }
