const { version } = require('../package.json');
const request = require('request');
var userName = require('git-user-name');
var fse = require('fs-extra');
var path = require('path');
const fs = require('fs');
const readline = require('readline');

const WEB_HOOK =
  'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=d57bb8ec-34f5-4641-91b1-e6ca908d37e3';

function getChangeLog() {
  const f = path.join(__dirname, '../CHANGELOG.md');
  if (!fse.existsSync(f)) return;
  const FRStream = fs.createReadStream(f);
  const rl = readline.createInterface({
    input: FRStream,
    crlfDelay: Infinity,
  });
  return new Promise((resolve) => {
    const result = [];
    let isEnterChange = false;
    let enterRegex = new RegExp(`^## \\[${version}\\]`);
    rl.on('line', function (input) {
      if (/^## \[(\d*\.?)*\]/.test(input)) {
        if (isEnterChange) {
          isEnterChange = false;
          FRStream.close();
        }
      }
      if (enterRegex.test(input)) {
        isEnterChange = true;
      }
      if (isEnterChange) {
        result.push(input);
      }
    });

    FRStream.on('close', () => resolve(result.join('\n')));
  });
}

getChangeLog().then((changelog) => {
  const data = {
    msgtype: 'markdown',
    markdown: {
      content: `@rh/cli 发布成功，最新版本号为<font color="warning">${version}</font>
      发布人：${userName()}
      发布时间：${new Date()}
      Changelog：
      
      -------------------------


      ${changelog}`,
    },
  };
  request.post(
    WEB_HOOK,
    {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    function (err, resp, body) {
      if (err) {
        console.error(err);
      }
    },
  );
});
