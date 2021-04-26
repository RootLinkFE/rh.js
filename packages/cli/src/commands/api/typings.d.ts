declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare module 'kubesphere' {
  // 打开个人设置弹窗
  export function OpenUserSettingModal(): Promise<void>;

  // 获取渲染kubeapp的方法
  export function getKubeAppRender(): Promise<void>;
  export function getKubeApp(): Promise<React.ReactElement>;
}

declare module 'chinese-to-pinyin' {
  const pinyin: (s: string) => string;
  export default pinyin;
}
