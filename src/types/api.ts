/** 通用 API 响应包装 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  msg?: string;
  total?: number;
}

/** 文章 */
export interface ArticleItem {
  id: string;
  name: string;
  introduction: string;
  label: string[];       // JSON 数组，label UUID 列表
  text: string;           // Markdown 正文
  show: boolean;
  class: number;          // 1=博客, 2=手册, 3=关于
  weight: number;
  read: number;
  love: number;
  createdAt: string;
  updatedAt: string;
}

/** 标签 */
export interface LabelItem {
  id: string;
  name: string;
  show: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 项目 */
export interface ProjectItem {
  id: string;
  name: string;
  introduction: string;
  urlname: string;
  github: string;
  icons: string;
  createdAt: string;
  updatedAt: string;
}

/** 简历 / 经历 */
export interface ResumeItem {
  id: string;
  name: string;
  introduction: string;
  weight: number;
  dataList: any[];       // JSON 数组
  createdAt: string;
  updatedAt: string;
}

/** 留言 */
export interface MessageItem {
  id: string;
  name: string;
  username: string;
  imgage?: string;
  value: string;
  type: string;
  adminmsg?: string;
  admindata?: string;
  state: number;          // 0=待审核, 1=已通过
  createdAt: string;
  updatedAt: string;
}

/** 手册 / 合集 */
export interface ManualItem {
  id: string;
  name: string;
  imgs: string;
  introduction: string;
  list?: { id: string; name: string; introduction: string }[];
  createdAt: string;
  updatedAt: string;
}

/** 站点设置 / 左侧栏信息 */
export interface SettingInfo {
  imgs?: string;          // 头像
  github?: string;        // GitHub 链接
  juejin?: string;        // 掘金链接
  name?: string;          // 站长昵称
  nameimgs?: string;      // 站点 Logo
}

/** 分页参数 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
