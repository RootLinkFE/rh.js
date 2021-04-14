const package = require('../package.json');
const request = require('request');
const git = require('git-last-commit');

const WEB_HOOK =
  'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=d57bb8ec-34f5-4641-91b1-e6ca908d37e3';

git.getLastCommit(function (err, commit) {
  const data = {
    msgtype: 'markdown',
    markdown: {
      content: `@rh/cli 发布成功，最新版本号为<font color="warning">${
        package.version
      }</font>
    最后修改人：${commit.committer.name}(${commit.committer.email})
    最后修改时间：${new Date(commit.committedOn * 1000)}
    信息：${commit.subject}`,
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
