export interface BasePageResultOfProjectMainRespObject {
  /** @format int32 */
  code?: number;
  data?: ProjectMainRespObject[];
  desc?: string;
  first?: boolean;
  last?: boolean;

  /** @format int64 */
  number?: number;

  /** @format int64 */
  size?: number;
  success?: boolean;

  /** @format int64 */
  totalPages?: number;

  /** @format int64 */
  totalSize?: number;
}

export interface BaseResultOfListOfProjectMainDetailRespObject {
  /** @format int32 */
  code?: number;
  data?: ProjectMainDetailRespObject[];
  desc?: string;
  success?: boolean;
}

export interface BaseResultOfListOfProjectMenuRespObject {
  /** @format int32 */
  code?: number;
  data?: ProjectMenuRespObject[];
  desc?: string;
  success?: boolean;
}

export interface BaseResultOfListOfProjectVersionRespObject {
  /** @format int32 */
  code?: number;
  data?: ProjectVersionRespObject[];
  desc?: string;
  success?: boolean;
}

export interface BaseResultOfProjectMainDetailRespObject {
  /** @format int32 */
  code?: number;

  /** 项目表 */
  data?: ProjectMainDetailRespObject;
  desc?: string;
  success?: boolean;
}

export interface BaseResultOfboolean {
  /** @format int32 */
  code?: number;
  data?: boolean;
  desc?: string;
  success?: boolean;
}

export interface BaseResultOflong {
  /** @format int32 */
  code?: number;

  /** @format int64 */
  data?: number;
  desc?: string;
  success?: boolean;
}

export interface BaseResultOfstring {
  /** @format int32 */
  code?: number;
  data?: string;
  desc?: string;
  success?: boolean;
}

export interface CommonIdParamObject {
  /**
   * 数据ID
   * @format int64
   */
  id: number;
}

export interface File {
  absolute?: boolean;
  absoluteFile?: File;
  absolutePath?: string;
  canonicalFile?: File;
  canonicalPath?: string;
  directory?: boolean;
  executable?: boolean;
  file?: boolean;

  /** @format int64 */
  freeSpace?: number;
  hidden?: boolean;

  /** @format int64 */
  lastModified?: number;
  name?: string;
  parent?: string;
  parentFile?: File;
  path?: string;
  readable?: boolean;

  /** @format int64 */
  totalSpace?: number;

  /** @format int64 */
  usableSpace?: number;
  writable?: boolean;
}

export type InputStream = any;

/**
 * 项目表
 */
export interface ProjectMainDetailRespObject {
  /** #api接口地址:域名# */
  apiPath?: string;

  /** #项目描述# */
  description?: string;

  /**
   * #计划周期结束时间#
   * @format date-time
   */
  endTime?: string;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /** #项目logo路径# */
  logoPath?: string;

  /** #项目名称# */
  name?: string;

  /** #项目名路径(英文)# */
  namePath?: string;

  /**
   * #项目负责人id#REF#b_base_user.id#
   * @format int64
   */
  ownerId?: number;

  /** #项目负责人名称# */
  ownerName?: string;

  /**
   * #父级项目id#REF#t_project.id#
   * @format int64
   */
  parentId?: number;

  /** #父级项目名称# */
  parentName?: string;

  /**
   * #原型版本迭代次数#
   * @format int32
   */
  prdCount?: number;

  /**
   * #计划周期开始时间#
   * @format date-time
   */
  startTime?: string;

  /**
   * #UI版本迭代次数#
   * @format int32
   */
  uiCount?: number;
}

/**
 * 项目表
 */
export interface ProjectMainPageParamObject {
  /** #项目名称# */
  name?: string;

  /** @format int32 */
  page?: number;

  /** @format int32 */
  pageSize?: number;
}

/**
 * 项目表
 */
export interface ProjectMainParamObject {
  /** #api接口地址:域名# */
  apiPath?: string;

  /** #项目描述# */
  description: string;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /** #项目logo路径# */
  logoPath?: string;

  /** #项目名称# */
  name: string;

  /** #项目名路径(英文)# */
  namePath: string;

  /**
   * #项目负责人id#REF#b_base_user.id#
   * @format int64
   */
  ownerId: number;

  /**
   * #父级项目id#REF#t_project.id#第一级传：0，第二级传对应的上级id#
   * @format int64
   */
  parentId?: number;
}

/**
 * 项目表
 */
export interface ProjectMainRespObject {
  /** #api接口地址:域名# */
  apiPath?: string;

  /** #子对象列表# */
  childList?: ProjectMainRespObject[];

  /**
   * #创建时间#
   * @format date-time
   */
  createTime?: string;

  /** #项目描述# */
  description?: string;

  /**
   * #计划周期开始时间#
   * @format date-time
   */
  endTime?: string;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /** #有无直接原型# */
  isHavePrd?: boolean;

  /** #有无直接UI# */
  isHaveUi?: boolean;

  /** #项目logo路径# */
  logoPath?: string;

  /**
   * #子项目模块数量#
   * @format int32
   */
  moduleCount?: number;

  /** #项目名称# */
  name?: string;

  /** #项目名路径(英文)# */
  namePath?: string;

  /**
   * #项目负责人id#REF#b_base_user.id#
   * @format int64
   */
  ownerId?: number;

  /** #项目负责人名称# */
  ownerName?: string;

  /**
   * #父级项目id#REF#t_project.id#
   * @format int64
   */
  parentId?: number;

  /**
   * #原型版本迭代次数#
   * @format int32
   */
  prdCount?: number;

  /** #原型地址# */
  prdPath?: string;

  /**
   * #计划周期开始时间#
   * @format date-time
   */
  startTime?: string;

  /**
   * #UI版本迭代次数#
   * @format int32
   */
  uiCount?: number;

  /** #UI地址# */
  uiPath?: string;
}

/**
 * 项目菜单表
 */
export interface ProjectMenuRespObject {
  /** #菜单编号# */
  code?: string;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /** #菜单html文件访问路径# */
  menuFilePath?: string;

  /** #菜单名称# */
  menuName?: string;

  /** #菜单图片预览路径# */
  menuPreviewPath?: string;

  /**
   * #父级菜单id#REF#b_project_menu.id#
   * @format int64
   */
  parentId?: number;

  /**
   * #项目版本id#REF#b_project_version.id#
   * @format int64
   */
  projectVersionId?: number;
  subNode?: ProjectMenuRespObject[];
}

/**
 * 项目版本表
 */
export interface ProjectVersionParamObject {
  /** #更新日志#数组# */
  changeLogs: string[];

  /**
   * #计划周期结束时间#
   * @format date-time
   */
  endTime?: string;

  /**
   * #上传文件#
   * @format binary
   */
  file: File;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /**
   * #项目id#REF#b_project_main.id#
   * @format int64
   */
  projectMainId: number;

  /**
   * #计划周期开始时间#
   * @format date-time
   */
  startTime?: string;

  /** #上传简要标题# */
  title: string;

  /**
   * #模块类型#ENUM#1:原型,2:UI#
   * @format int32
   */
  type: number;
}

/**
 * 项目版本表
 */
export interface ProjectVersionRespObject {
  /** #更新日志# */
  changeLogs?: string[];

  /**
   * #创建时间#
   * @format date-time
   */
  createTime?: string;

  /**
   * #计划周期结束时间#
   * @format date-time
   */
  endTime?: string;

  /** #文件路径# */
  filePath?: string;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /**
   * #项目id#REF#b_project_main.id#
   * @format int64
   */
  projectMainId?: number;

  /**
   * #计划周期开始时间#
   * @format date-time
   */
  startTime?: string;

  /** #简要标题# */
  title?: string;

  /**
   * #模块类型#ENUM#1:原型,2:UI#
   * @format int32
   */
  type?: number;
}

export interface Resource {
  description?: string;
  file?: File;
  filename?: string;
  inputStream?: InputStream;
  open?: boolean;
  readable?: boolean;
  uri?: URI;
  url?: URL;
}

export interface URI {
  absolute?: boolean;
  authority?: string;
  fragment?: string;
  host?: string;
  opaque?: boolean;
  path?: string;

  /** @format int32 */
  port?: number;
  query?: string;
  rawAuthority?: string;
  rawFragment?: string;
  rawPath?: string;
  rawQuery?: string;
  rawSchemeSpecificPart?: string;
  rawUserInfo?: string;
  scheme?: string;
  schemeSpecificPart?: string;
  userInfo?: string;
}

export interface URL {
  authority?: string;
  content?: any;

  /** @format int32 */
  defaultPort?: number;
  deserializedFields?: URLStreamHandler;
  file?: string;
  host?: string;
  path?: string;

  /** @format int32 */
  port?: number;
  protocol?: string;
  query?: string;
  ref?: string;

  /** @format int32 */
  serializedHashCode?: number;
  userInfo?: string;
}

export type URLStreamHandler = any;
