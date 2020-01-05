/**
 * @author Grapedge
 * @description SDU add course script
 */
const app = require('./src/app');

const config = {
  username: '学号',
  password: '密码',
  course: [
    {
      kch: '0233215812',
      kxh: '0'
    },
    {
      kch: 'sd00130080',
      kxh: '0'
    }
  ]
};

app(config);
