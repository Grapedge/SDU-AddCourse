# SDU Add Course

This script is used to assist students in SDU to add courses. The script works with the latest course selection system and uses unified login authentication. If you are about to graduate but have some important obligatory courses that are hard to grab, you can use this script to help you add courses.

## Require

- You should install `Node.JS` and you can download it here: [Node.JS](https://nodejs.org/zh-cn/).

- Install tutorial: [菜鸟教程-Node.JS 安装教程](https://www.runoob.com/nodejs/nodejs-install-setup.html)

## Use

prepare: 
```bash
> git clone git@github.com:Grapedge/SDU-AddCourse.git add-course
> cd add-course
> npm install
```

open `index.js` and modify `config`:

```js
const config = {
  username: '学号', // 你的学号
  password: '密码', // 你的密码
  // 你需要选择的课程列表
  // 参考下面的示例进行添加
  // kch: 课程号
  // kxh: 课序号
  course: [
    {
      kch: '0233215812',
      kxh: '0'
    },
    {
      kch: 'sd00130080',
      kxh: '0'
    }
    ,
    {
      kch: 'sd00130081',
      kxh: '600'
    }
  ]
};
```

then, run script:

```bash
> node ./index.js
```