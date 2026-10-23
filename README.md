# Nuxt3 技术栈规范

## 目录结构规范

// ... existing code ...

## 项目使用说明

### 1. 安装依赖

推荐使用 [pnpm](https://pnpm.io/zh/)（也支持 npm/yarn）：

```bash
pnpm install
# 或
npm install
# 或
yarn install
```

### 2. 本地开发启动

```bash
pnpm dev
# 或
npm run dev
# 或
yarn dev
```

### 3. 构建打包

支持多环境构建，常用命令如下：

```bash
# 生产环境
pnpm run build:online
# 测试环境
pnpm run build:test
# 默认构建
pnpm build
```

### 4. 预览生产环境

```bash
pnpm preview
# 或
npm run preview
# 或
yarn preview
```

### 5. 代码检查与修复

```bash
pnpm lint        # 代码检查
pnpm fix         # 自动修复
```

### 6. 环境变量配置

- `.env.local`：本地开发环境变量
- `.env.prod`：生产环境变量
- `.env.test`：测试环境变量

根据实际需求修改对应的 API 地址、密钥等配置。

### 7. 主要目录结构说明

```bash
├── api/           # 业务 API 封装
├── assets/        # 静态资源（图片、样式等）
├── components/    # 通用、业务、UI 组件
├── composables/   # 组合式函数（如 useIMKit）
├── directives/    # 自定义指令
├── layouts/       # 页面布局
├── lib/           # 公共库与工具
├── pages/         # 页面路由
├── plugins/       # Nuxt 插件
├── public/        # 公共静态资源
├── stores/        # Pinia 状态管理
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数
```

### 8. 常用依赖说明

- **Nuxt3**：主框架
- **Pinia**：状态管理
- **Axios**：请求库
- **Tailwind CSS**：原子化 CSS
- **@nuxtjs/i18n**：多语言支持
- **@vueuse/core**：Vue 实用工具集
- **shadcn-nuxt**、**reka-ui**、**lucide-vue-next**：UI 组件库

### 9. 其他说明

- 代码风格、提交规范、目录结构等请参考下方 Nuxt3 技术栈规范与开发规范章节。
- 推荐使用 VSCode + Volar 插件进行开发，获得最佳 TypeScript 支持体验。

## 部署与环境说明

1. **正式环境域名**： [www.imastudio.com](https://www.imastudio.com)
2. **测试环境域名**： [qa.imastudio.com](https://qa.imastudio.com) | [qa.imagent.bot](https://qa.imagent.bot)
3. **正式环境构建流程**：
   - 线上发起 merge request 到 main 分支
   - 触发 tag 构建，自动部署到正式环境
   - tag 命名规范：`release-nodejs-online-YYYYMMDD`，如：`release-nodejs-online-20250515`
   - C3 构建地址:
4. **测试环境构建流程**：
   - 代码 push 到 test 分支后，webhook 自动触发构建
   - 自动部署到测试环境
   - C3 构建地址：

> 如需配置正式环境 C3 地址，请联系运维或相关负责人。
