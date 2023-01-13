const muiComponents = require('@mui/material');

const components = {};

Object.keys(muiComponents).forEach((name) => {
  // Only export components, assuming exports that start with a capital letter
  // are always components.
  if (name[0].toUpperCase() === name[0]) {
    components[name] = muiComponents[name];
  }
});

module.exports = components;
