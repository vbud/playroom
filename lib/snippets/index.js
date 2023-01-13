const glob = require('fast-glob');

module.exports = glob.sync('snippets/**.snippets.js').map((filename) => {
  const matches = filename.match(/([a-zA-Z]+)\.snippets\.js?$/);
  if (!matches) {
    return [];
  }

  const snippets = require(filename).snippets ?? [];

  return snippets.map(({ name, code }) => ({
    group: matches[1],
    name,
    code,
  }));
});
