export type Repository = {
  type: string;
  repoType: string;
  alias: string;
  name: string;
  gitPath: string;
  jsonFile: string;
  active: boolean;
};

export type Block = {
  title: string;
  name: string;
  value: string;
  key: string;
  description: string;
  url: string;
  type: 'block' | 'page';
  path: string;
  isPage: false;
  defaultPath: string;
  img: string;
  tags: string[];
  previewUrl: string;
  features: string[];
};
