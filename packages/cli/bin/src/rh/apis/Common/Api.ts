import {
  BasePageResultOfBaseProjectUserRespObject,
  BasePageResultOfBaseUserRespObject,
  BasePositionParamObject,
  BaseProjectUserPageParamObject,
  BaseProjectUserParamObject,
  BaseResultOfBaseUserRespObject,
  BaseResultOfboolean,
  BaseResultOfListOfBasePositionRespObject,
  BaseResultOfListOfBaseUserSimplyRespObject,
  BaseResultOfLoginRespObject,
  BaseResultOflong,
  BaseUsernameParamObject,
  BaseUserPageParamObject,
  BaseUserParamObject,
  CommonIdParamObject,
  LoginParamObject,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "../http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 职位表新增
   *
   * @tags 职位表 前端控制器
   * @name BasePositionAdd
   * @summary 职位表新增
   * @request POST:/api/devops-project-rp/common/base-position/add
   * @response `200` `BaseResultOflong` OK
   */
  basePositionAdd = (param: BasePositionParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOflong, any>({
      path: `/api/devops-project-rp/common/base-position/add`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 查询职位表不分页列表
   *
   * @tags 职位表 前端控制器
   * @name BasePositionGetList
   * @summary 查询职位表不分页列表
   * @request GET:/api/devops-project-rp/common/base-position/getList
   * @response `200` `BaseResultOfListOfBasePositionRespObject` OK
   */
  basePositionGetList = (params: RequestParams = {}) =>
    this.request<BaseResultOfListOfBasePositionRespObject, any>({
      path: `/api/devops-project-rp/common/base-position/getList`,
      method: "GET",
      ...params,
    });
  /**
   * @description 项目与用户关系表删除
   *
   * @tags 项目与用户关系表 前端控制器
   * @name BaseProjectUserDeleteById
   * @summary 项目与用户关系表删除
   * @request POST:/api/devops-project-rp/common/base-project-user/deleteById
   * @response `200` `BaseResultOfboolean` OK
   */
  baseProjectUserDeleteById = (commonIdParam: CommonIdParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/common/base-project-user/deleteById`,
      method: "POST",
      body: commonIdParam,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 项目与用户关系表分页查询
   *
   * @tags 项目与用户关系表 前端控制器
   * @name BaseProjectUserPageByParam
   * @summary 项目与用户关系表分页查询
   * @request POST:/api/devops-project-rp/common/base-project-user/pageByParam
   * @response `200` `BasePageResultOfBaseProjectUserRespObject` OK
   */
  baseProjectUserPageByParam = (param: BaseProjectUserPageParamObject, params: RequestParams = {}) =>
    this.request<BasePageResultOfBaseProjectUserRespObject, any>({
      path: `/api/devops-project-rp/common/base-project-user/pageByParam`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 项目与用户关系表更新
   *
   * @tags 项目与用户关系表 前端控制器
   * @name BaseProjectUserUpdateById
   * @summary 项目与用户关系表更新
   * @request POST:/api/devops-project-rp/common/base-project-user/updateById
   * @response `200` `BaseResultOfboolean` OK
   */
  baseProjectUserUpdateById = (param: BaseProjectUserParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/common/base-project-user/updateById`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 用户信息表新增
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserAdd
   * @summary 用户信息表新增
   * @request POST:/api/devops-project-rp/common/base-user/add
   * @response `200` `BaseResultOflong` OK
   */
  baseUserAdd = (param: BaseUserParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOflong, any>({
      path: `/api/devops-project-rp/common/base-user/add`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 用户信息表删除
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserDeleteById
   * @summary 用户信息表删除
   * @request POST:/api/devops-project-rp/common/base-user/deleteById
   * @response `200` `BaseResultOfboolean` OK
   */
  baseUserDeleteById = (commonIdParam: CommonIdParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/common/base-user/deleteById`,
      method: "POST",
      body: commonIdParam,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 根据ID查询用户信息表详情
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserGetById
   * @summary 根据ID查询用户信息表详情
   * @request GET:/api/devops-project-rp/common/base-user/getById
   * @response `200` `BaseResultOfBaseUserRespObject` OK
   */
  baseUserGetById = (query: { id: number }, params: RequestParams = {}) =>
    this.request<BaseResultOfBaseUserRespObject, any>({
      path: `/api/devops-project-rp/common/base-user/getById`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 用户信息表不分页查询
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserList
   * @summary 用户信息表不分页查询
   * @request POST:/api/devops-project-rp/common/base-user/list
   * @response `200` `BaseResultOfListOfBaseUserSimplyRespObject` OK
   */
  baseUserList = (param: BaseUsernameParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfListOfBaseUserSimplyRespObject, any>({
      path: `/api/devops-project-rp/common/base-user/list`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 用户信息表-登出
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserLogOut
   * @summary 用户信息表-登出
   * @request POST:/api/devops-project-rp/common/base-user/logOut
   * @response `200` `BaseResultOfboolean` OK
   */
  baseUserLogOut = (params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/common/base-user/logOut`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 用户信息表-登录
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserLogin
   * @summary 用户信息表-登录
   * @request POST:/api/devops-project-rp/common/base-user/login
   * @response `200` `BaseResultOfLoginRespObject` OK
   */
  baseUserLogin = (param: LoginParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfLoginRespObject, any>({
      path: `/api/devops-project-rp/common/base-user/login`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 用户信息表分页查询
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserPageByParam
   * @summary 用户信息表分页查询
   * @request POST:/api/devops-project-rp/common/base-user/pageByParam
   * @response `200` `BasePageResultOfBaseUserRespObject` OK
   */
  baseUserPageByParam = (param: BaseUserPageParamObject, params: RequestParams = {}) =>
    this.request<BasePageResultOfBaseUserRespObject, any>({
      path: `/api/devops-project-rp/common/base-user/pageByParam`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 用户信息表-刷新token
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserRefreshToken
   * @summary 用户信息表-刷新token
   * @request POST:/api/devops-project-rp/common/base-user/refreshToken
   * @response `200` `BaseResultOfLoginRespObject` OK
   */
  baseUserRefreshToken = (params: RequestParams = {}) =>
    this.request<BaseResultOfLoginRespObject, any>({
      path: `/api/devops-project-rp/common/base-user/refreshToken`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 用户信息表更新
   *
   * @tags 用户信息表 前端控制器
   * @name BaseUserUpdateById
   * @summary 用户信息表更新
   * @request POST:/api/devops-project-rp/common/base-user/updateById
   * @response `200` `BaseResultOfboolean` OK
   */
  baseUserUpdateById = (param: BaseUserParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/common/base-user/updateById`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
}
