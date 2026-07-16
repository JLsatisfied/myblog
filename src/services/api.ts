/**
 * API 接口 —— blogService /pc 公共端点
 *
 * 所有 /pc 接口均为公开接口（无需认证）。
 */

import { get, post } from './request';
import type {
  ApiResponse,
  ArticleItem,
  LabelItem,
  ProjectItem,
  ResumeItem,
  MessageItem,
  ManualItem,
  SettingInfo,
  PaginationParams,
} from '@/types/api';

// ─── 文章 ──────────────────────────────────────────────────

/** 获取已发布文章列表（class=1, show=true） */
export function getArticles(params?: PaginationParams) {
  return get<ApiResponse<ArticleItem[]>>('/pc/getTextLits', params as Record<string, unknown>);
}

/** 获取单篇文章详情（会累加阅读量） */
export function getArticleDetail(id: string) {
  return get<ApiResponse<ArticleItem>>('/pc/getText', { id });
}

/** 获取最近更新的 10 篇文章 */
export function getLatestArticles() {
  return get<ApiResponse<ArticleItem[]>>('/pc/latelyGetText');
}

/** 获取阅读量最高的 10 篇文章 */
export function getHotArticles() {
  return get<ApiResponse<ArticleItem[]>>('/pc/hotGetText');
}

/** 按日期排序获取文章列表 */
export function getArticlesByDate(params?: PaginationParams) {
  return get<ApiResponse<ArticleItem[]>>('/pc/getTextDataLits', params as Record<string, unknown>);
}

/** 获取"关于我"文章（class=3, 取第一篇） */
export function getAbout() {
  return get<ApiResponse<ArticleItem | null>>('/pc/getabout');
}

// ─── 标签 ──────────────────────────────────────────────────

/** 获取所有可见标签 */
export function getAllLabels() {
  return get<ApiResponse<LabelItem[]>>('/pc/getTableAll');
}

/** 按标签筛选文章 */
export function getArticlesByLabel(labelId: string, params?: PaginationParams) {
  return get<ApiResponse<ArticleItem[]>>('/pc/tableGetText', {
    id: labelId,
    ...params,
  } as Record<string, unknown>);
}

/** 获取单个标签名称 */
export function getLabelName(id: string) {
  return get<ApiResponse<LabelItem>>('/pc/tableNames', { id });
}

// ─── 项目 ──────────────────────────────────────────────────

/** 获取所有项目 */
export function getProjects() {
  return get<ApiResponse<ProjectItem[]>>('/pc/getProjectList');
}

// ─── 手册 ──────────────────────────────────────────────────

/** 获取所有手册（不含文章列表） */
export function getManuals() {
  return get<ApiResponse<ManualItem[]>>('/pc/getManual');
}

/** 分页获取手册 */
export function getManualsPaginated(params?: PaginationParams) {
  return get<ApiResponse<ManualItem[]>>('/pc/getManualPage', params as Record<string, unknown>);
}

/** 获取单本手册详情（含文章列表） */
export function getManualDetail(id: string) {
  return get<ApiResponse<ManualItem>>('/pc/getManualTxts', { id });
}

// ─── 简历 / 经历 ──────────────────────────────────────────

/** 获取所有简历/经历条目 */
export function getResume() {
  return get<ApiResponse<ResumeItem[]>>('/pc/getExperience');
}

// ─── 留言 ──────────────────────────────────────────────────

/** 获取已审核通过的留言 */
export function getMessages(params?: PaginationParams) {
  return get<ApiResponse<MessageItem[]>>('/pc/searchMsg', params as Record<string, unknown>);
}

/** 提交留言 */
export function submitMessage(body: {
  name: string;
  username: string;
  imgage?: string;
  value: string;
  type?: string;
}) {
  return post<ApiResponse<{ msg: string }>>('/pc/addMessage', body);
}

// ─── 站点设置 ──────────────────────────────────────────────

/** 获取站点左侧栏信息（头像、社交链接、昵称等） */
export function getSettings() {
  return get<ApiResponse<SettingInfo>>('/pc/searchMsgAdminsLeft');
}

/** 获取管理员显示信息 */
export function getAdminInfo() {
  return get<ApiResponse<{ name: string | null; nameimgs: string | null }>>('/pc/searchMsgAdmins');
}
