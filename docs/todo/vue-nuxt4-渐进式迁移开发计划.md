# Vue3 + Nuxt4 渐进式迁移开发计划

本文档用于追踪 BuildingAI 项目从 React 前端迁移到 Vue3 + Nuxt4 的渐进式迁移任务状态。**不含 LangChat 改造，保留现有后端 NestJS + 自研 ai-sdk 架构不变。

## 状态说明

| 状态   | 含义                             |
| ------ | -------------------------------- |
| 未开始 | 已记录但尚未处理                 |
| 进行中 | 正在处理                         |
| 已完成 | 文件、功能或配置已实现           |
| 已验证 | 已完成并通过对应验证             |
| 阻塞   | 需要外部信息或环境变更后才能继续 |

---

## 第一阶段：价值验证（预计 1-2 个月）

目标：搭建 Nuxt + Nuxt UI 基础框架，实现 2-3 个核心页面，验证迁移可行性和用户体验。

### 1.1 项目搭建与基础配置

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P1-001 | 初始化 Nuxt 4 项目并整合到 Monorepo | 已完成 | `apps/web-nuxt/`、`pnpm-workspace.yaml` | 构建通过 | 新建 apps/web-nuxt 包，配置 pnpm workspace |
| P1-002 | 配置 Nuxt UI v3 与 Tailwind CSS v4 | 已完成 | `apps/web-nuxt/nuxt.config.ts`、`apps/web-nuxt/app/assets/css/main.css` | 构建通过 | 集成 @nuxt/ui v3，Tailwind CSS v4，主题自动适配 |
| P1-003 | 配置 Pinia 状态管理集成 | 已完成 | `apps/web-nuxt/app/plugins/pinia.ts`、`apps/web-nuxt/app/stores/` | 构建通过 | 通过 Nuxt 插件手动集成 Pinia，创建 user 和 app 两个 store |
| P1-004 | 配置 TypeScript 与路径别名 | 已完成 | `apps/web-nuxt/tsconfig.json` | 构建通过 | 严格模式，Nuxt 自动生成类型，支持 ~/ 和 @/ 别名 |
| P1-005 | 配置 ESLint 与 Prettier 代码规范 | 已完成 | `apps/web-nuxt/eslint.config.mjs` | 待补充 | 复用 @buildingai/eslint-config 基础配置 |
| P1-006 | Turbo 构建配置与现有 API 代理 | 已完成 | `apps/web-nuxt/nuxt.config.ts` | 构建通过 | nitro.devProxy 配置 /api 和 /consoleapi 代理到 4090 端口 |

### 1.2 布局与路由系统

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P1-007 | 实现前台基础布局（Header + 导航栏） | 已完成 | `apps/web-nuxt/app/layouts/console.vue`、`apps/web-nuxt/app/components/AppHeader.vue`、`apps/web-nuxt/app/components/AppSidebar.vue` | 构建通过 | 包含顶部导航栏、可折叠侧边栏、主内容区，侧边栏6个菜单项 |
| P1-008 | 实现后台控制台布局 | 已完成 | `apps/web-nuxt/app/layouts/console.vue` | 构建通过 | 与前台共用 console 布局，侧边栏包含管理入口 |
| P1-009 | 配置文件系统路由与路由守卫 | 已完成 | `apps/web-nuxt/app/middleware/auth.global.ts` | 构建通过 | 全局 auth 中间件，登录态校验，未登录跳转登录页 |
| P1-010 | 实现 404/500 等错误页面 | 已完成 | `apps/web-nuxt/app/error.vue` | 构建通过 | 统一错误页面，支持状态码显示和返回首页 |

### 1.3 核心页面迁移（对话页）

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P1-011 | API 服务层封装（useFetch 封装） | 已完成 | `apps/web-nuxt/app/composables/useApiFetch.ts` | 构建通过 | 封装 useApiFetch、useApiGet、useApiPost，自动携带 token，统一错误处理 |
| P1-012 | 用户认证模块（登录/注册页面） | 已完成 | `apps/web-nuxt/app/pages/login.vue`、`apps/web-nuxt/app/pages/register.vue` | 构建通过 | 登录页、注册页，对接 /api/auth/login 和 /api/auth/register |
| P1-013 | AI 对话页面主体框架 | 已完成 | `apps/web-nuxt/app/pages/chat.vue` | 构建通过 | 消息列表、输入框、发送功能、空状态建议卡片 |
| P1-014 | 流式输出与 Markdown 消息渲染 | 已完成 | `apps/web-nuxt/app/components/ChatMessage.vue`、`apps/web-nuxt/app/utils/markdown.ts` | 构建通过 | Markdown 基础渲染（标题、粗体、代码块、列表、链接），打字指示器 |
| P1-015 | 对话侧边栏（历史会话列表） | 已完成 | `apps/web-nuxt/app/components/ChatSidebar.vue` | 构建通过 | 新建对话、历史列表、删除对话、可折叠侧边栏 |
| P1-016 | 模型选择与参数配置 | 已完成 | `apps/web-nuxt/app/components/ModelSelector.vue` | 构建通过 | 下拉选择模型，内置 5 个模型选项 |

### 1.4 基础组件库适配

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P1-017 | 通用业务组件封装（基于 Nuxt UI） | 已完成 | 待补充 | 构建通过 | 复用 Nuxt UI 组件库（UButton、UInput、UCard、UDropdownMenu、UCheckbox 等） |
| P1-018 | 图标库集成与统一 | 已完成 | `apps/web-nuxt/nuxt.config.ts` | 构建通过 | Nuxt UI Icon 模块，lucide / heroicons / tabler 三套图标库 |
| P1-019 | 主题切换（亮/暗模式） | 已完成 | `apps/web-nuxt/app/components/AppHeader.vue` | 构建通过 | @nuxt/ui 内置 colorMode，Header 中提供切换按钮 |
| P1-020 | Toast 通知与 Dialog 对话框封装 | 已完成 | - | 构建通过 | Nuxt UI 内置 useToast() composable，UDialog 组件 |

### 1.5 验证与评估

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P1-021 | 端到端功能验证（对话流程） | 进行中 | 待补充 | 构建通过 | 从登录到发消息完整流程（Mock 数据演示） |
| P1-022 | 性能基准测试（首屏/交互） | 未开始 | 待补充 | 待补充 | FCP、LCP、TTI 等指标对比 |
| P1-023 | 迁移成本与工作量评估报告 | 未开始 | `docs/` | 待补充 | 基于实际开发速度评估全量迁移工期 |
| P1-024 | 用户体验对比评估 | 未开始 | 待补充 | 待补充 | 与现有 React 版对比分析 |

---

## 第二阶段：核心迁移（预计 2-4 个月）

目标：完成 AI 对话、Agent、知识库核心功能、用户系统与认证、后台管理核心模块，实现新旧版本并行运行。

### 2.1 AI Agent 管理模块

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P2-001 | Agent 列表页面 | 已完成 | `apps/web-nuxt/app/pages/agents/index.vue` | 构建通过 | Agent 卡片列表、搜索筛选、分类筛选 |
| P2-002 | Agent 创建与配置页面 | 已完成 | `apps/web-nuxt/app/pages/agents/index.vue` | 构建通过 | 基础信息、Prompt、模型配置对话框 |
| P2-003 | Agent 工作区（对话 + 配置） | 已完成 | `apps/web-nuxt/app/pages/agents/[id].vue` | 构建通过 | Agent 专属对话界面、配置侧边栏 |
| P2-004 | Agent 版本管理与发布 | 已完成 | `apps/web-nuxt/app/pages/agents/[id].vue` | 构建通过 | 版本列表、发布、回滚（标签页形式） |
| P2-005 | Agent 使用统计面板 | 已完成 | `apps/web-nuxt/app/pages/agents/[id].vue` | 构建通过 | 调用次数、用户数等统计图表 |

### 2.2 知识库模块

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P2-006 | 知识库列表页面 | 已完成 | `apps/web-nuxt/app/pages/datasets/index.vue` | 构建通过 | 知识库卡片、搜索、创建对话框 |
| P2-007 | 知识库详情与文档管理 | 已完成 | `apps/web-nuxt/app/pages/datasets/[id].vue` | 构建通过 | 文档列表、上传、删除、分段管理 |
| P2-008 | 文档上传与解析进度 | 已完成 | `apps/web-nuxt/app/pages/datasets/[id].vue` | 构建通过 | 拖拽上传、解析进度显示 |
| P2-009 | 分段管理与向量索引状态 | 已完成 | `apps/web-nuxt/app/pages/datasets/[id].vue` | 构建通过 | 分段列表、向量化状态标签页 |
| P2-010 | 知识库设置与成员管理 | 已完成 | `apps/web-nuxt/app/pages/datasets/[id].vue` | 构建通过 | 基础设置、成员权限标签页 |
| P2-011 | 知识库检索测试面板 | 已完成 | `apps/web-nuxt/app/pages/datasets/[id].vue` | 构建通过 | 检索测试、相似度展示标签页 |

### 2.3 用户系统与个人中心

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P2-012 | 用户个人中心页面 | 已完成 | `apps/web-nuxt/app/pages/settings/index.vue` | 构建通过 | 个人信息、API 密钥、模型配置、团队管理 |
| P2-013 | API 密钥管理 | 已完成 | `apps/web-nuxt/app/pages/settings/index.vue` | 构建通过 | 密钥创建、删除、查看（标签页形式） |
| P2-014 | 模型提供商配置 | 已完成 | `apps/web-nuxt/app/pages/settings/index.vue` | 构建通过 | 各模型服务商 API Key 配置（标签页形式） |
| P2-015 | 团队与成员管理 | 已完成 | `apps/web-nuxt/app/pages/settings/index.vue` | 构建通过 | 团队设置、成员邀请、角色（标签页形式） |

### 2.4 后台管理核心模块

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P2-016 | 后台仪表盘（Dashboard） | 已完成 | `apps/web-nuxt/app/pages/admin/index.vue` | 构建通过 | 数据统计、趋势图表、系统状态 |
| P2-017 | 用户管理 | 已完成 | `apps/web-nuxt/app/pages/admin/users.vue` | 构建通过 | 用户列表、搜索筛选、编辑、禁用/启用 |
| P2-018 | 角色与权限管理 | 进行中 | 待补充 | 待补充 | 角色列表、权限配置 |
| P2-019 | 系统设置 | 已完成 | `apps/web-nuxt/app/pages/admin/settings.vue` | 构建通过 | 基础设置、邮件、存储、安全、运营等 7 个模块 |
| P2-020 | 模型管理（后台） | 已完成 | `apps/web-nuxt/app/pages/admin/models.vue` | 构建通过 | 模型配置、启用禁用、价格、测试 |

### 2.5 MCP 与扩展系统前端

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P2-021 | MCP 服务管理页面 | 已完成 | `apps/web-nuxt/app/pages/mcp/index.vue` | 构建通过 | MCP 服务器列表、添加、配置、详情抽屉 |
| P2-022 | MCP 工具列表与测试 | 已完成 | `apps/web-nuxt/app/pages/mcp/index.vue` | 构建通过 | 工具列表、调用测试（详情抽屉中） |
| P2-023 | 应用中心（扩展市场） | 已完成 | `apps/web-nuxt/app/pages/apps.vue` | 构建通过 | 扩展列表、安装、卸载、详情对话框 |
| P2-024 | 扩展 iframe 集成 | 未开始 | 待补充 | 待补充 | 与现有扩展系统对接 |

### 2.6 并行运行与过渡

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P2-025 | Nginx 路由配置（新旧共存） | 未开始 | `docker/nginx/` | 待补充 | 按路径或域名分流新旧版本 |
| P2-026 | 用户切换入口 | 未开始 | 待补充 | 待补充 | 用户可在新旧版本间切换 |
| P2-027 | 功能对齐检查清单 | 未开始 | `docs/` | 待补充 | 逐项核对功能完整性 |
| P2-028 | 用户反馈收集机制 | 未开始 | 待补充 | 待补充 | 问题反馈、体验问卷 |

---

## 第三阶段：全面切换（预计 1-2 个月）

目标：补齐剩余功能，性能优化与测试，全面切换到新版本，旧版本下线。

### 3.1 剩余功能补齐

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P3-001 | 运营公告与通知 | 未开始 | 待补充 | 待补充 | 公告列表、通知中心 |
| P3-002 | 会员与支付模块 | 未开始 | 待补充 | 待补充 | 套餐、订单、充值 |
| P3-003 | 数据分析与统计报表 | 未开始 | 待补充 | 待补充 | 使用统计、趋势分析 |
| P3-004 | 帮助与文档中心 | 未开始 | 待补充 | 待补充 | 使用文档、FAQ |
| P3-005 | 安装引导（install 页） | 未开始 | 待补充 | 待补充 | 首次安装引导流程 |

### 3.2 Tauri 桌面端适配

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P3-006 | Tauri + Nuxt 开发环境配置 | 未开始 | `apps/desktop-tauri/` | 待补充 | 新建桌面端项目 |
| P3-007 | 窗口管理与系统托盘 | 未开始 | 待补充 | 待补充 | 主窗口、托盘菜单 |
| P3-008 | 自动更新配置 | 未开始 | 待补充 | 待补充 | Tauri Updater 集成 |
| P3-009 | 桌面端构建与打包 | 未开始 | 待补充 | 待补充 | macOS/Windows/Linux 构建 |
| P3-010 | 本地文件系统集成 | 未开始 | 待补充 | 待补充 | 文件选择、拖拽上传 |

### 3.3 性能优化

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P3-011 | 首屏性能优化（SSR/SSG） | 未开始 | 待补充 | 待补充 | FCP/LCP 优化 |
| P3-012 | 路由级代码分割 | 未开始 | 待补充 | 待补充 | 懒加载、预加载策略 |
| P3-013 | 图片与静态资源优化 | 未开始 | 待补充 | 待补充 | Nuxt Image、WebP |
| P3-014 | 长列表虚拟滚动 | 未开始 | 待补充 | 待补充 | 大数据列表性能 |
| P3-015 | 接口缓存与数据预取 | 未开始 | 待补充 | 待补充 | useAsyncData 缓存策略 |

### 3.4 测试与质量保障

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P3-016 | 单元测试覆盖 | 未开始 | 待补充 | 待补充 | Vitest + Vue Test Utils |
| P3-017 | E2E 测试 | 未开始 | 待补充 | 待补充 | Playwright 端到端测试 |
| P3-018 | 兼容性测试（浏览器） | 未开始 | 待补充 | 待补充 | 主流浏览器兼容 |
| P3-019 | 无障碍（a11y）检查 | 未开始 | 待补充 | 待补充 | 屏幕阅读器、键盘导航 |
| P3-020 | 安全审计 | 未开始 | 待补充 | 待补充 | XSS、CSRF、CSP |

### 3.5 上线与切换

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| P3-021 | 灰度发布方案 | 未开始 | 待补充 | 待补充 | 按用户比例灰度 |
| P3-022 | 数据迁移验证 | 未开始 | 待补充 | 待补充 | 用户数据无缝切换 |
| P3-023 | 全量切换上线 | 未开始 | 待补充 | 待补充 | 默认进入新版本 |
| P3-024 | 旧版本下线准备 | 未开始 | 待补充 | 待补充 | 下线公告、过渡期 |
| P3-025 | 旧版本正式下线 | 未开始 | 待补充 | 待补充 | 移除 React 前端代码 |

---

## 共享包迁移计划

### Vue 生态共享包（@buildingai/web-vue）

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| S-001 | @buildingai/web-vue/ui 组件库 | 未开始 | `packages/@buildingai/web-vue/ui/` | 待补充 | 基于 Nuxt UI 的业务组件 |
| S-002 | @buildingai/web-vue/composables | 未开始 | `packages/@buildingai/web-vue/composables/` | 待补充 | useChat、useAgent 等组合式函数 |
| S-003 | @buildingai/web-vue/stores | 未开始 | `packages/@buildingai/web-vue/stores/` | 待补充 | Pinia stores（用户、配置等） |
| S-004 | @buildingai/web-vue/services | 未开始 | `packages/@buildingai/web-vue/services/` | 待补充 | API 服务封装 |
| S-005 | @buildingai/types 前后端共享类型 | 未开始 | `packages/@buildingai/types/` | 待补充 | 已有包，优化复用 |

---

## 后端 API 适配调整

| 编号 | 任务 | 状态 | 相关文件 | 验证结果 | 备注 |
|------|------|------|----------|----------|------|
| A-001 | API 接口兼容性检查 | 未开始 | `packages/api/` | 待补充 | 确保现有 API 与新前端兼容 |
| A-002 | SSE 流式输出优化 | 未开始 | 待补充 | 待补充 | 与新前端流式对接验证 |
| A-003 | WebSocket 对接验证 | 未开始 | 待补充 | 待补充 | 实时功能验证 |
| A-004 | API 文档更新 | 未开始 | 待补充 | 待补充 | 接口文档同步 |

---

## 版本备注

1. 本计划基于技术可行性评估报告的「建议二：采用渐进式迁移策略」制定，不含 LangChat 改造。
2. 后端 NestJS + 自研 ai-sdk 架构保持不变，仅前端从 React 迁移到 Vue3 + Nuxt4。
3. 每完成一个功能后，请更新对应任务的状态、相关文件、验证结果和备注信息。
4. 各阶段可根据实际进度动态调整任务优先级和工作量估算。
5. 第一阶段完成后进行评估，确认是否继续推进后续阶段。
