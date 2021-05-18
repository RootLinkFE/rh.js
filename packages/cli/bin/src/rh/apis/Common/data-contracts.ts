export interface BasePageResultOfBaseProjectUserRespObject {
  /** @format int32 */
  code?: number;
  data?: BaseProjectUserRespObject[];
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

export interface BasePageResultOfBaseUserRespObject {
  /** @format int32 */
  code?: number;
  data?: BaseUserRespObject[];
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

/**
 * 职位表
 */
export interface BasePositionParamObject {
  /** #描述# */
  description?: string;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /** #职位名称# */
  name: string;
}

/**
 * 职位表
 */
export interface BasePositionRespObject {
  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /** #职位名称# */
  name?: string;
}

/**
 * 项目与用户关系表
 */
export interface BaseProjectUserPageParamObject {
  /** #项目名称# */
  name?: string;

  /** @format int32 */
  page?: number;

  /** @format int32 */
  pageSize?: number;
}

/**
 * 项目与用户关系表
 */
export interface BaseProjectUserParamObject {
  /**
   * #项目id#REF#b_project_main.id#
   * @format int64
   */
  projectMainId?: number;

  /** #用户id数组# */
  userIdList?: number[];
}

/**
 * 项目与用户关系表
 */
export interface BaseProjectUserRespObject {
  /**
   * #项目id#REF#b_project_main.id#
   * @format int64
   */
  projectMainId?: number;

  /** #项目名称# */
  projectName?: string;

  /** #用户姓名数组# */
  realNameList?: string[];

  /** #用户id数组# */
  userIdList?: number[];
}

export interface BaseResultOfBaseUserRespObject {
  /** @format int32 */
  code?: number;

  /** 用户信息表 */
  data?: BaseUserRespObject;
  desc?: string;
  success?: boolean;
}

export interface BaseResultOfListOfBasePositionRespObject {
  /** @format int32 */
  code?: number;
  data?: BasePositionRespObject[];
  desc?: string;
  success?: boolean;
}

export interface BaseResultOfListOfBaseUserSimplyRespObject {
  /** @format int32 */
  code?: number;
  data?: BaseUserSimplyRespObject[];
  desc?: string;
  success?: boolean;
}

export interface BaseResultOfLoginRespObject {
  /** @format int32 */
  code?: number;

  /** 登录返回参数对象 */
  data?: LoginRespObject;
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

/**
 * 用户信息表
 */
export interface BaseUserObject {
  /**
   * #用户类型#ENUM#0:超管,1:普通用户#
   * @format int32
   */
  accountType?: number;

  /** @format date-time */
  createTime?: string;
  creator?: string;

  /** @format int32 */
  deleteFlag?: number;

  /** #描述# */
  description?: string;

  /** #邮箱# */
  email?: string;

  /** @format int64 */
  id?: number;

  /**
   * #最后登录时间#
   * @format date-time
   */
  lastLoginTime?: string;

  /**
   * #登录时间#
   * @format date-time
   */
  loginTime?: string;

  /** #手机# */
  mobile?: string;
  modifier?: string;

  /** #昵称# */
  nickname?: string;

  /** #密码# */
  password?: string;

  /** #职位# */
  position?: string;

  /** #真实姓名# */
  realName?: string;

  /**
   * #性别#EMUN#0:男:MAN,1:女:FEMALE#
   * @format int32
   */
  sex?: number;

  /**
   * #用户状态#ENUM#0:未启用,1:启用#
   * @format int32
   */
  status?: number;

  /** @format date-time */
  updateTime?: string;

  /** #用户名# */
  username?: string;

  /** @format int32 */
  version?: number;
}

/**
 * 用户信息表
 */
export interface BaseUserPageParamObject {
  /** @format int32 */
  page?: number;

  /** @format int32 */
  pageSize?: number;

  /** #职位# */
  position?: string;

  /** #真实姓名# */
  realName?: string;

  /** #用户名# */
  username?: string;
}

/**
 * 用户信息表
 */
export interface BaseUserParamObject {
  /** #描述# */
  description?: string;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /** #密码# */
  password?: string;

  /** #职位# */
  position: string;

  /** #真实姓名# */
  realName: string;

  /** #用户名# */
  username: string;
}

/**
 * 用户信息表
 */
export interface BaseUserRespObject {
  /**
   * #创建时间#
   * @format date-time
   */
  createTime?: string;

  /** #描述# */
  description?: string;

  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /**
   * #最后登录时间#
   * @format date-time
   */
  lastLoginTime?: string;

  /** #密码# */
  password?: string;

  /** #职位# */
  position?: string;

  /** #真实姓名# */
  realName?: string;

  /** #用户名# */
  username?: string;
}

/**
 * 用户信息表
 */
export interface BaseUserSimplyRespObject {
  /**
   * #主键id#
   * @format int64
   */
  id?: number;

  /** #真实姓名# */
  realName?: string;
}

/**
 * 用户信息表
 */
export interface BaseUsernameParamObject {
  /** #用户名# */
  realName?: string;
}

export interface CommonIdParamObject {
  /**
   * 数据ID
   * @format int64
   */
  id: number;
}

/**
 * 用户登录
 */
export interface LoginParamObject {
  /** #账号或手机号# */
  account?: string;

  /** #密码# */
  password?: string;
}

/**
 * 登录返回参数对象
 */
export interface LoginRespObject {
  /**
   * #过期时间#
   * @format int64
   */
  expireTime?: number;

  /** #用户信息# */
  info?: BaseUserObject;

  /** #token# */
  token?: string;
}
