import {
  BasePageResultOfProjectMainRespObject,
  BaseResultOfboolean,
  BaseResultOfListOfProjectMainDetailRespObject,
  BaseResultOfListOfProjectMenuRespObject,
  BaseResultOfListOfProjectVersionRespObject,
  BaseResultOflong,
  BaseResultOfProjectMainDetailRespObject,
  BaseResultOfstring,
  CommonIdParamObject,
  File,
  ProjectMainPageParamObject,
  ProjectMainParamObject,
  ProjectVersionParamObject,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "../http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description 项目表新增
   *
   * @tags 项目表 前端控制器
   * @name ProjectMainAdd
   * @summary 项目表新增
   * @request POST:/api/devops-project-rp/project/project-main/add
   * @response `200` `BaseResultOflong` OK
   */
  projectMainAdd = (param: ProjectMainParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOflong, any>({
      path: `/api/devops-project-rp/project/project-main/add`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 项目表删除
   *
   * @tags 项目表 前端控制器
   * @name ProjectMainDeleteById
   * @summary 项目表删除
   * @request POST:/api/devops-project-rp/project/project-main/deleteById
   * @response `200` `BaseResultOfboolean` OK
   */
  projectMainDeleteById = (commonIdParam: CommonIdParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/project/project-main/deleteById`,
      method: "POST",
      body: commonIdParam,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 根据ID查询项目表详情
   *
   * @tags 项目表 前端控制器
   * @name ProjectMainGetById
   * @summary 根据ID查询项目表详情
   * @request GET:/api/devops-project-rp/project/project-main/getById
   * @response `200` `BaseResultOfProjectMainDetailRespObject` OK
   */
  projectMainGetById = (query: { id: number }, params: RequestParams = {}) =>
    this.request<BaseResultOfProjectMainDetailRespObject, any>({
      path: `/api/devops-project-rp/project/project-main/getById`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 根据ID查询子项目列表
   *
   * @tags 项目表 前端控制器
   * @name ProjectMainGetChildList
   * @summary 根据ID查询子项目列表
   * @request GET:/api/devops-project-rp/project/project-main/getChildList
   * @response `200` `BaseResultOfListOfProjectMainDetailRespObject` OK
   */
  projectMainGetChildList = (query: { id: number }, params: RequestParams = {}) =>
    this.request<BaseResultOfListOfProjectMainDetailRespObject, any>({
      path: `/api/devops-project-rp/project/project-main/getChildList`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 项目表分页查询-主页
   *
   * @tags 项目表 前端控制器
   * @name ProjectMainMainPageByParam
   * @summary 项目表分页查询-主页
   * @request POST:/api/devops-project-rp/project/project-main/mainPageByParam
   * @response `200` `BasePageResultOfProjectMainRespObject` OK
   */
  projectMainMainPageByParam = (pageParam: ProjectMainPageParamObject, params: RequestParams = {}) =>
    this.request<BasePageResultOfProjectMainRespObject, any>({
      path: `/api/devops-project-rp/project/project-main/mainPageByParam`,
      method: "POST",
      body: pageParam,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 项目表分页查询-列表
   *
   * @tags 项目表 前端控制器
   * @name ProjectMainPageByParam
   * @summary 项目表分页查询-列表
   * @request POST:/api/devops-project-rp/project/project-main/pageByParam
   * @response `200` `BasePageResultOfProjectMainRespObject` OK
   */
  projectMainPageByParam = (param: ProjectMainPageParamObject, params: RequestParams = {}) =>
    this.request<BasePageResultOfProjectMainRespObject, any>({
      path: `/api/devops-project-rp/project/project-main/pageByParam`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 项目表更新
   *
   * @tags 项目表 前端控制器
   * @name ProjectMainUpdateById
   * @summary 项目表更新
   * @request POST:/api/devops-project-rp/project/project-main/updateById
   * @response `200` `BaseResultOfboolean` OK
   */
  projectMainUpdateById = (param: ProjectMainParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/project/project-main/updateById`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 项目菜单表查询-树状结构
   *
   * @tags 项目菜单表 前端控制器
   * @name ProjectMenuGetTree
   * @summary 项目菜单表查询-树状结构
   * @request GET:/api/devops-project-rp/project/project-menu/getTree
   * @response `200` `BaseResultOfListOfProjectMenuRespObject` OK
   */
  projectMenuGetTree = (query: { id: number }, params: RequestParams = {}) =>
    this.request<BaseResultOfListOfProjectMenuRespObject, any>({
      path: `/api/devops-project-rp/project/project-menu/getTree`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 项目版本表新增
   *
   * @tags 项目版本表 前端控制器
   * @name ProjectVersionAdd
   * @summary 项目版本表新增
   * @request POST:/api/devops-project-rp/project/project-version/add
   * @response `200` `BaseResultOflong` OK
   */
  projectVersionAdd = (
    query: {
      changeLogs: string[];
      endTime?: string;
      projectMainId: number;
      startTime?: string;
      title: string;
      type: number;
    },
    data: { file: File },
    params: RequestParams = {},
  ) =>
    this.request<BaseResultOflong, any>({
      path: `/api/devops-project-rp/project/project-version/add`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * @description 项目版本表删除
   *
   * @tags 项目版本表 前端控制器
   * @name ProjectVersionDeleteById
   * @summary 项目版本表删除
   * @request POST:/api/devops-project-rp/project/project-version/deleteById
   * @response `200` `BaseResultOfboolean` OK
   */
  projectVersionDeleteById = (commonIdParam: CommonIdParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/project/project-version/deleteById`,
      method: "POST",
      body: commonIdParam,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description UI下载
   *
   * @tags 项目版本表 前端控制器
   * @name ProjectVersionDownload
   * @summary UI下载
   * @request GET:/api/devops-project-rp/project/project-version/download
   * @response `200` `BaseResultOfstring` OK
   */
  projectVersionDownload = (query: { id: number }, params: RequestParams = {}) =>
    this.request<BaseResultOfstring, any>({
      path: `/api/devops-project-rp/project/project-version/download`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 项目版本表列表查询
   *
   * @tags 项目版本表 前端控制器
   * @name ProjectVersionGetList
   * @summary 项目版本表列表查询
   * @request GET:/api/devops-project-rp/project/project-version/getList
   * @response `200` `BaseResultOfListOfProjectVersionRespObject` OK
   */
  projectVersionGetList = (query: { id: string; type: string }, params: RequestParams = {}) =>
    this.request<BaseResultOfListOfProjectVersionRespObject, any>({
      path: `/api/devops-project-rp/project/project-version/getList`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 项目版本表更新
   *
   * @tags 项目版本表 前端控制器
   * @name ProjectVersionUpdateById
   * @summary 项目版本表更新
   * @request POST:/api/devops-project-rp/project/project-version/updateById
   * @response `200` `BaseResultOfboolean` OK
   */
  projectVersionUpdateById = (param: ProjectVersionParamObject, params: RequestParams = {}) =>
    this.request<BaseResultOfboolean, any>({
      path: `/api/devops-project-rp/project/project-version/updateById`,
      method: "POST",
      body: param,
      type: ContentType.Json,
      ...params,
    });
}
