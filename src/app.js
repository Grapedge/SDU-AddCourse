const auth = require('./auth');
const fetch = require('./api/fetch');

const queryURL = 'http://bkjwxk.sdu.edu.cn/b/xk/xs/kcsearch';
const queryCourse = async (kch, kxh) => {
  let pageCnt = 1;
  for (let i = 1; i <= pageCnt; i++) {
    const res = await fetch(queryURL, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `type=kc&currentPage=1&kch=${kch}&jsh=&skxq=&skjc=&kkxsh=`,
      method: 'POST'
    });
    const { resultList, totalPages } = (await res.json()).object;
    pageCnt = totalPages;
    for (let x of resultList) {
      if (x.KXH === kxh) {
        return [x.kyl > 0, x];
      }
    }
  }
};

const addCourse = async (kch, kxh) => {
  const res = await fetch(
    `http://bkjwxk.sdu.edu.cn/b/xk/xs/add/${kch}/${kxh}`,
    {
      method: 'POST'
    }
  );
  const json = await res.json();
  if (json.msg.indexOf('成功') === -1) {
    return [false, json.msg];
  } else {
    return [true, 'success'];
  }
};
const app = async config => {
  // 因为懒得处理cookie生效时间了，所以直接写死循环了
  const failCourse = [];
  while (true) {
    try {
      // 登录
      const loginRes = await auth(config.username, config.password);
      if (loginRes[0] === false) {
        console.log('登录失败：', loginRes[1]);
        return false;
      }
      // add course
      console.log('登录成功');
      // 获取课程信息
      const { course } = config;
      let queryKCount = {};
      let queryCount = {};
      for (const { kch, kxh } of course) {
        queryCount[kch + kxh] = 0;
        queryKCount[kch + kxh] = 0;
      }
      // 如果没有选完课
      while (course.length > 0) {
        for (const c of course) {
          const { kch, kxh } = c;
          // 查询课余量
          const data = await queryCourse(kch, kxh);
          if (data[0]) {
            const addRes = await addCourse(kch, kxh);
            if (addRes[0]) {
              console.log(`【${data[1].KCM}】选课成功！`);
              course.splice(course.indexOf(c), 1);
            } else if (addRes[1].indexOf('频繁') === -1) {
              // 如果不是因为访问过于频繁，删除此课
              console.log(
                `【${data[1].KCM}】选课失败：${addRes[1]}，本次选课将不会继续对此课程进行处理...`
              );
              failCourse.push(data[1]);
              course.splice(course.indexOf(c), 1);
            }
          } else {
            const key = kch + kxh;
            if (queryCount[key] % 1000 === 0) {
              queryCount[key] = 0;
              ++queryKCount[key];
              console.log(
                `第${queryKCount[key]}K次查询【${data[1].KCM}】课余量不足，正在持续查询中...`
              );
            }
            ++queryCount[key];
          }
        }
      }
      console.log('所有课程已选完。');
      if (failCourse.length > 0) {
        console.log(`其中${failCourse.map(v => v.KCM).join(',')}选课失败`);
      }
      return true;
    } catch (e) {
      console.log('错误:', e);
    }
  }
};

module.exports = app;
