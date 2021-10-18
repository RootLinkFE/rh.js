import { defineConfig } from 'dumi';
// import commonjs from '@rollup/plugin-commonjs';

// more config: https://d.umijs.org/config
export default defineConfig({
  title: '@roothub/components',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  styles: ['https://cdn.staticfile.org/antd/4.16.11/antd.min.css'],
  // 单语言配置方式如下
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/RootLinkFE/rh.js',
    },
  ],
  plugins: ['@rollup/plugin-commonjs'],
});
