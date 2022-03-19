const request = require('request');
var userName = require('git-user-name');
var fse = require('fs-extra');
var path = require('path');
const fs = require('fs');
const readline = require('readline');

const WEB_HOOK = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${process.env.WECOM_WEBHOOK_KEY}`;

function getChangeLog(changeLogPath = '', version) {
  const f = path.join(changeLogPath, '../CHANGELOG.md');
  if (!fse.existsSync(f)) return;

  const FRStream = fs.createReadStream(f);
  const rl = readline.createInterface({
    input: FRStream,
    crlfDelay: Infinity,
  });
  return new Promise((resolve) => {
    const result = [];
    let isEnterChange = false;
    let enterRegex = new RegExp(`^## ${version}`);
    // let enterRegex = new RegExp(`^## \\[${version}\\]`);
    let count = 0;
    rl.on('line', function (input) {
      if (/^#+ \[?(\d+\.?)*\]?/.test(input)) {
        if (isEnterChange) {
          isEnterChange = false;
          FRStream.close();
        }
      }
      if (enterRegex.test(input)) {
        count += 1;
        isEnterChange = true;
      }
      if (isEnterChange && count <= 1) {
        result.push(input);
      }
    });

    FRStream.on('close', () => resolve(result.join('\n')));
  });
}

function notice(packageName, changeLogPath) {
  console.log('changeLogPath=', changeLogPath);
  const { version } = require(`${path.join(changeLogPath, '../package.json')}`);

  getChangeLog(changeLogPath, version).then((changelog) => {
    const data = {
      msgtype: 'markdown',
      markdown: {
        content: `${packageName} 发布成功，最新版本号为<font color="warning">${version}</font>
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
}

module.exports = notice;
