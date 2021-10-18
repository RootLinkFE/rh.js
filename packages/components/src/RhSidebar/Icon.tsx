import { createFromIconfontCN } from '@ant-design/icons';

const RhMenuIcon = (scriptUrl = '') => {
  return createFromIconfontCN({
    scriptUrl: scriptUrl || 'https://at.alicdn.com/t/font_1464531_wtmw6sdb439.js',
  });
};

export default RhMenuIcon;
