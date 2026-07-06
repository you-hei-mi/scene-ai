# 扩展应用前端迁移计划

## 目标

将 `/extensions` 下的 React + Vite 扩展应用迁移为 Vue3 + Vite。

## 技术栈

- **前端**: Vue 3.5 + Vite + Vue Router + Pinia + Tailwind CSS
- **UI 组件**: 使用 Tailwind CSS 自定义组件（参考 @buildingai/web-vue/ui）
- **后端**: NestJS + TypeORM（保持不变）
- **构建**: Vite（保持不变）

## 迁移范围

### simple-blog（8 个前端页面）

| 页面 | 路径 | 优先级 |
|------|------|--------|
| 博客首页 | `pages/index.vue` | P0 |
| 文章详情 | `pages/article/[id].vue` | P0 |
| 文章列表（控制台） | `pages/console/article/list.vue` | P0 |
| 添加文章 | `pages/console/article/add.vue` | P1 |
| 编辑文章 | `pages/console/article/edit.vue` | P1 |
| 文章表单组件 | `pages/console/article/components/form.vue` | P1 |
| 栏目列表 | `pages/console/column/list.vue` | P2 |
| 编辑栏目 | `pages/console/column/edit.vue` | P2 |

### infinite-canvas（11 个前端页面）

| 页面 | 路径 | 优先级 |
|------|------|--------|
| 首页 | `pages/home.vue` | P0 |
| 画布列表 | `pages/canvas-list.vue` | P0 |
| 画布编辑 | `pages/canvas-page.vue` | P0 |
| 控制台总览 | `pages/console/overview.vue` | P1 |
| 资产管理 | `pages/asset-manager.vue` | P2 |
| 提示词库 | `pages/prompt-library.vue` | P2 |
| API 设置 | `pages/api-settings.vue` | P2 |
| ComfyUI 设置 | `pages/comfyui-settings.vue` | P2 |
| 工作流 | `pages/workflows.vue` | P2 |
| 任务 | `pages/tasks.vue` | P2 |

## 迁移步骤

1. **框架迁移** ✅
   - 更新 `package.json`（React → Vue3 依赖）
   - 更新 `vite.config.ts`（添加 Vue 插件）
   - 更新 `tsconfig.json`
   - 迁移 `main.tsx` → `main.ts`
   - 迁移 `routes.tsx` → `router/index.ts`

2. **服务层迁移** ✅
   - React hooks (TanStack Query) → Vue composables
   - 保持 HTTP 客户端不变

3. **页面组件迁移** ✅
   - `.tsx` → `.vue`（SFC 格式）
   - React hooks → Vue composables
   - React Router → Vue Router
   - @buildingai/ui 组件 → 自定义 Tailwind 组件

4. **后端保持不变** ✅
   - API 模块、控制器、服务、实体全部保留

## 完成状态

| 扩展 | 页面总数 | Vue 迁移数 | 状态 |
|------|----------|-----------|------|
| simple-blog | 8 | 8 (P0+P1+P2) | ✅ 已完成 |
| infinite-canvas | 11 | 11 (P0+P1+P2) | ✅ 已完成 |
