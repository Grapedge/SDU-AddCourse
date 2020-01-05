const fetch = require('./api/fetch');
const desEnc = require('./api/des');

const getLoginData = async url => {
  const res = await fetch(url, {
    method: 'get'
  });
  const html = await res.text();
  return {
    lt: /name="lt" value="(.*)"/.exec(html)[1],
    _eventId: /name="_eventId" value="(.*)"/.exec(html)[1],
    execution: /name="execution" value="(.*)"/.exec(html)[1]
  };
};

const login = async (username, password, from) => {
  const url = `http://passt.sdu.edu.cn/cas/login?service=${from}`;
  // get cookie and other datas
  const { lt, _eventId, execution } = await getLoginData(url);
  // login
  const rsa = desEnc(username + password + lt, '1', '2', '3');
  let res = await fetch(url, {
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: `rsa=${rsa}&ul=${username.length}&pl=${password.length}&lt=${lt}&execution=${execution}&_eventId=${_eventId}`,
    redirect: 'manual'
  });
  const text = await res.text();
  const errorReg = /id="errormsg".*?>(.*?)<\//;
  const error = errorReg.exec(text);
  if (error != null) {
    return [false, error[1]];
  }
  // manual redirect and get cookie
  res = await fetch(res.headers.raw()['location'][0], { redirect: 'manual' });
  await fetch(res.headers.raw()['location'][0], { redirect: 'manual' });
  // login success
  return [true, 'success'];
};

module.exports = (username, password) =>
  login(
    username,
    password,
    'http://bkjwxk.sdu.edu.cn/f/j_spring_security_thauth_roaming_entry'
  );
