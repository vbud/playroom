const lzString = require('lz-string');

const compressParams = ({ code }) => {
  const data = JSON.stringify({
    ...(code ? { code } : {}),
  });

  return lzString.compressToEncodedURIComponent(data);
};

const createUrl = ({ baseUrl, code, paramType = 'hash' }) => {
  let path = '';

  if (code) {
    const compressedData = compressParams({ code });

    path = `${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}/${path}`;
  }

  return path;
};

const createPreviewUrl = ({ baseUrl, code, paramType = 'hash' }) => {
  let path = '';

  if (code) {
    const compressedData = compressParams({ code });

    path = `/preview/${paramType === 'hash' ? '#' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}${path}`;
  }

  return path;
};

module.exports = {
  compressParams,
  createUrl,
  createPreviewUrl,
};
