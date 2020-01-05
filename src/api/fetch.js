const _fetch = require('node-fetch');
const cookie = require('cookie');

const cookies = {};
const getOrigin = url => {
  const arr = url.split('/');
  return arr[0] + '//' + arr[2];
};

function serialize(cookieObj) {
  return (
    (cookieObj &&
      Object.keys(cookieObj).map(v => cookie.serialize(v, cookieObj[v]))) ||
    []
  );
}

const fetch = async (url, params = {}) => {
  const origin = getOrigin(url);
  let headers = { ...params.headers };
  headers['cookie'] = serialize(cookies[origin]).join(';');
  const res = await _fetch(url, { ...params, headers });
  cookies[origin] = {
    ...cookies[origin],
    ...cookie.parse((res.headers.raw()['set-cookie'] || []).join(';'))
  };
  return res;
};

module.exports = fetch;
