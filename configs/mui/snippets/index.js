import { flatten } from 'lodash';

const req = require.context('.', true, /\.snippets\.tsx?$/);

export default flatten(
  req.keys().map((filename) => {
    const matches = filename.match(/([a-zA-Z]+)\.snippets\.tsx?$/);
    if (!matches) {
      return [];
    }

    const snippets = req(filename).snippets ?? [];

    return snippets.map(({ name, code }) => ({
      group: matches[1],
      name,
      code,
    }));
  })
);
