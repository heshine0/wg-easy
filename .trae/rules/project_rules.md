# WG-Easy Project Rules

## Project Overview

WG-Easy 是一个基于 Nuxt 3 的全栈应用程序，用于简化 WireGuard VPN 的管理。项目采用 Vue 3 + TypeScript + Tailwind CSS 构建前端，使用 Nitro + Drizzle ORM + LibSQL 构建后端。

## Technology Stack

- **Framework**: Nuxt 3 (Vue 3)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x
- **Database**: LibSQL (SQLite) with Drizzle ORM
- **State Management**: Pinia
- **UI Components**: Radix Vue
- **Icons**: Heroicons
- **Charts**: ApexCharts
- **Package Manager**: pnpm

## Code Style Guidelines

### TypeScript

- 使用严格的 TypeScript 类型
- 优先使用 `type` 而不是 `interface`
- 使用 `defineProps` 和 `defineEmits` 进行组件类型定义
- 使用 `~/` 别名引用项目根目录
- 使用 `#db/` 别名引用数据库相关模块

### Vue Components

- 使用 `<script setup lang="ts">` 语法
- 组件名使用 PascalCase
- Props 使用严格的类型定义
- 使用 `defineProps<{}>()` 定义 props 类型

```vue
<script setup lang="ts">
defineProps<{
  client: LocalClient;
}>();
</script>
```

### Formatting

- **缩进**: 2 个空格
- **引号**: 单引号
- **分号**: 必须
- **尾随逗号**: ES5 风格
- **最大行宽**: 遵循 Prettier 默认配置

### Tailwind CSS

- 使用 Tailwind 的类名进行样式设置
- 支持暗黑模式，使用 `dark:` 前缀
- 颜色使用语义化命名：`gray-500`, `neutral-400` 等
- 响应式断点：`xxs`, `sm`, `md`, `lg`

```vue
<div class="flex flex-col gap-3 px-3 py-3 sm:flex-row dark:text-neutral-400">
```

## Project Structure

```
src/
├── app/                    # Nuxt 应用 (前端)
│   ├── components/         # Vue 组件
│   │   ├── ClientCard/     # 客户端卡片相关组件
│   │   ├── Clients/        # 客户端列表相关组件
│   │   ├── Form/           # 表单组件
│   │   ├── Header/         # 头部组件
│   │   └── Icons/          # 图标组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 布局组件
│   ├── middleware/         # 中间件
│   ├── pages/              # 页面路由
│   ├── plugins/            # 插件
│   ├── stores/             # Pinia 状态管理
│   └── utils/              # 工具函数
├── server/                 # 服务端 (Nitro)
│   ├── api/                # API 路由
│   └── database/           # 数据库
│       ├── migrations/     # 数据库迁移
│       └── repositories/   # 数据仓库
├── cli/                    # 命令行工具
├── i18n/                   # 国际化
└── public/                 # 静态资源
```

## Naming Conventions

### Files

- **Vue 组件**: PascalCase (e.g., `ClientCard.vue`)
- **TypeScript**: camelCase (e.g., `useColorMode.ts`)
- **API 路由**: camelCase with method suffix (e.g., `index.get.ts`, `create.post.ts`)
- **数据库 schema**: camelCase (e.g., `schema.ts`)

### Components

- 使用语义化的组件名
- 复合组件使用目录组织 (e.g., `ClientCard/ClientCard.vue`, `ClientCard/Name.vue`)

### Database

- 表名使用 snake_case (e.g., `clients_table`)
- 列名使用 snake_case (e.g., `ipv4_address`)
- 外键使用 `{table}_id` 格式 (e.g., `user_id`)

## API Patterns

### Event Handlers

使用 `definePermissionEventHandler` 进行权限控制：

```typescript
export default definePermissionEventHandler(
  'clients',
  'read',
  async ({ event, user }) => {
    // handler logic
  }
);
```

### Validation

使用 Zod 进行参数验证：

```typescript
const { filter } = await getValidatedQuery(
  event,
  validateZod(ClientQuerySchema, event)
);
```

## Database Patterns

### Schema Definition

使用 Drizzle ORM 定义表结构：

```typescript
export const client = sqliteTable('clients_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  // ...
});
```

### Relations

定义表关系：

```typescript
export const clientRelations = relations(client, ({ one }) => ({
  user: one(user, { fields: [client.userId], references: [user.id] }),
}));
```

## State Management

### Pinia Stores

使用组合式 API 风格：

```typescript
export const useAuthStore = defineStore('Auth', () => {
  const userData = useState<SharedPublicUser | null>('user-data', () => null);

  async function update() {
    // ...
  }

  return { userData, update };
});
```

## Internationalization

- 使用 `$t()` 进行文本翻译
- 语言文件位于 `src/i18n/locales/`
- 支持的语言在 `nuxt.config.ts` 中配置

## Commands

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint
pnpm typecheck
pnpm format:check

# 数据库
pnpm db:generate

# CLI 开发
pnpm cli:dev
```

## Important Notes

1. **权限**: 所有 API 路由必须使用 `definePermissionEventHandler` 进行权限控制
2. **类型安全**: 优先使用严格的 TypeScript 类型，避免使用 `any`
3. **暗黑模式**: 所有组件都需要支持暗黑模式
4. **响应式**: 使用 Tailwind 的响应式类名处理不同屏幕尺寸
5. **数据库**: 修改 schema 后必须生成迁移文件
6. **国际化**: 所有用户可见的文本都需要支持国际化
