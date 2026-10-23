# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Guidelines

**请始终使用简体中文与用户对话，并在回答时保持专业、简洁。**

- Use Simplified Chinese (简体中文) for all communication with the user
- Keep responses professional and concise
- Provide clear, actionable information without unnecessary verbosity

## Project Overview

**ImaStudio** is a Nuxt 3-based AI-powered media agent studio with community features, messaging, and multi-provider authentication. Built with TypeScript, Vue 3, Pinia, and Tailwind CSS v4.

- **Tech Stack**: Nuxt 3.17.7, Vue 3 Composition API, TypeScript, Pinia, Tailwind CSS v4
- **Primary Languages**: English (en) and Simplified Chinese (zh)
- **Base URL**: https://www.imastudio.com

## Essential Development Commands

### Development
```bash
npm run dev              # Start dev server with .env.local (localhost:3000)
npm run lint             # Run ESLint checks
npm run lint:fix         # Auto-fix linting issues (always run before commits)
```

### Build & Preview
```bash
npm run build:test       # Build for test environment (.env.test)
npm run build:beta       # Build for beta environment (.env.beta)
npm run build:online     # Build for production (.env.prod)
npm run preview          # Build test + start preview server
```

### Package Manager
**Use `pnpm` for installing dependencies** (configured in package.json overrides).

## Project Architecture

### Directory Structure & Auto-Import Conventions

**Components** (all auto-imported):
- `~/components/ui/*` → No prefix (e.g., `<Button>`, `<Dialog>`)
- `~/components/common/*` → `Cs*` prefix (e.g., `<CsFullLoader>`)
- `~/components/business/*` → `Bus*` prefix (e.g., `<BusActivityDialog>`)
- `~/components/prose/*` → `Md*` prefix, globally registered (e.g., `<MdH1>`)

**Composables** (`~/composables/*`):
Auto-imported with `use*` naming convention. Key composables:
- `useAuth*.ts` - Authentication flows
- `useLang(namespace)` - Dynamic i18n loading (call in `<script setup>`)
- `useToast()` - Toast notifications
- `useIMKit/*` - Messaging system
- `useConst()` - Constants (baseUrl, alias, etc.)
- `useUploadMediaFile()` - File uploads with compression
- `usePreviewMedia()` - Media preview

**Stores** (`~/stores/*`):
Auto-imported Pinia stores with persistent state:
- `useUserStore()` - User info, auth, login state
- `useSubsStore()` - Subscriptions/payments
- `useIMKitStore()` - Messaging/IM state
- `useGlobalConfigStore()` - App configuration
- `useSideBarStore()` - Sidebar state

### API Layer Pattern

**Location**: `~/api/*.ts`

All API files use a centralized Axios instance from `~/api/index.ts` with:
- Auto-injected headers: `ima_token`, `app_uid`, `x_app_language`, `Authorization`
- Request ID generation (nanoid)
- Global error handling with toast notifications
- SSR client IP passthrough
- Abort signal support

**Example**:
```typescript
// api/login.ts
export async function login(email: string, password: string) {
  return Api.post<UserInfoResponse>('/api/v1/webAgent/backend/user/login', {
    email,
    password: rsa.encrypt(password), // RSA encryption for sensitive data
    ...generateBaseParams()
  })
}
```

### Internationalization (i18n)

**Dynamic Loading System**:
- Translations in `~/i18n/locales/{en,zh}/*.json`
- Lazy-loaded by namespace (common.json, login.json, community.json, etc.)
- **Always call `useLang(namespace)` in components** to load translations before use

**Example**:
```vue
<script setup lang="ts">
const { t: $t } = useLang('community') // Loads community.json
</script>

<template>
  <h1>{{ $t('community.title') }}</h1>
</template>
```

### Middleware & Lifecycle

**Global Middleware** (`~/middleware/global.global.ts`):
- Initializes user store
- Tracks page performance metrics
- Initializes IM and global config on client

**Route Middleware**:
- `~/middleware/home.ts` - Home page initialization
- Add route-specific middleware as needed in `~/middleware/*.ts`

## Critical Rules & Conventions

### Tool Usage Priority (MANDATORY)

**Always prioritize MCP tools over built-in tools** when available:
- Use MCP filesystem tools (`mcp__filesystem__*`) for file operations when possible
- MCP tools may have fewer restrictions and better performance
- All available MCP tools are prefixed with `mcp__`

**Available MCP Categories**:
- `mcp__filesystem__*` - File system operations (read, write, edit, search, list, etc.)
- `mcp__Framelink_Figma_MCP__*` - Figma design integration
- `mcp__prompt__*` - Task management
- `mcp__sequential-thinking__*` - Deep analysis and reasoning
- `mcp__context7__*` - Library documentation retrieval
- `mcp__chrome-devtools__*` - Browser automation and testing

**Tool Permissions**:

Settings are merged according to priority (highest to lowest):
1. Enterprise policy
2. Command-line parameters
3. Local project settings (`.claude/settings.local.json`)
4. Shared project settings (`.claude/settings.json`)
5. User settings (`~/.claude/settings.json`)

**Current Project Permissions**:
- All MCP tools (`mcp_*`) are pre-approved (from user settings)
- Pre-approved Bash commands:
  - `Bash(cat:*)` - Read file contents
  - `Bash(npm run lint:fix:*)` - Auto-fix linting
  - `Bash(git mv:*)` - Rename files in Git

**Restrictions**:
- `git push` is prohibited - only local Git operations allowed (status, diff, log, commit)
- Screenshots limited to 7000px height maximum


### UI Component Priority (MANDATORY)

**When implementing UI features, follow this priority order**:

1. **Use existing components from `~/components/ui/`** (shadcn-nuxt based)
   - Available components: Button, Dialog, Input, Textarea, Select, Checkbox, Switch, Tabs, Tooltip, Popover, Drawer, AlertDialog, Avatar, Accordion, ContextMenu, DropdownMenu, Progress, ScrollArea, Skeleton, Slider, Stepper, Sonner (toast)
   - Always check `~/components/ui/` directory first before creating new components
   - Example: `<Button>`, `<Dialog>`, `<Input>`, `<Tooltip>`, etc.

2. **If design mockups are provided**:
   - Implement **pixel-perfect 1:1 restoration** of the design
   - Use Figma MCP tools (`mcp__Framelink_Figma_MCP__get_figma_data`) to extract design tokens
   - Match exact spacing, colors, typography, and layout from the design
   - Download design assets using `mcp__Framelink_Figma_MCP__download_figma_images`

3. **Only create new UI components** if:
   - No existing component matches the requirement
   - Design requires custom functionality not available in `~/components/ui/`
   - Place new components in `~/components/business/` for feature-specific components

### Tailwind CSS Coding Standards (MANDATORY)

**Follow the project's Tailwind CSS variable system** defined in `~/assets/tailwind.css`:

**Color System** (use these instead of arbitrary values):
```vue
<!-- ✅ CORRECT: Use design tokens -->
<div class="bg-gray-100 text-gray-900 border-gray-200">
<div class="bg-primary text-primary-foreground">
<div class="bg-background text-foreground">

<!-- ❌ WRONG: Don't use arbitrary values -->
<div class="bg-[#f5f5f5] text-[#333333]">
```

**Available Color Tokens**:
- **Gray palette**: `gray-50` to `gray-900`
- **Metal palette**: `metal-50` to `metal-900`
- **Indigo palette**: `indigo-50` to `indigo-900`
- **Orange palette**: `orange-50` to `orange-900`
- **Yellow palette**: `yellow-50` to `yellow-900`
- **Teal palette**: `teal-50` to `teal-900`
- **Lime palette**: `lime-50` to `lime-900`
- **Cyan palette**: `cyan-50` to `cyan-900`
- **Dark palette**: `dark`, `dark-50` to `dark-900`, `white`
- **Semantic colors**: `background`, `foreground`, `primary`, `primary-foreground`, `primary-active`, `border`, `input`, `ring`, `popover`, `popover-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`

**Typography System** (project-defined sizes):
```vue
<!-- ✅ CORRECT: Use project typography scale -->
<p class="text-xs">Extra small text (12px, line-height 1.333)</p>
<p class="text-sm">Small text (14px, line-height 1.571)</p>
<p class="text-base">Base text (15px, line-height 1.467)</p>
<p class="text-lg">Large text (17px, line-height 1.294)</p>
<p class="text-xl">Extra large text (20px, line-height 1.4)</p>

<!-- ❌ WRONG: Don't use arbitrary font sizes -->
<p class="text-[13px]">Text</p>
```

**Border Radius System**:
```vue
<!-- ✅ CORRECT: Use radius tokens -->
<div class="rounded-sm">  <!-- calc(var(--radius) - 2px) = 2px -->
<div class="rounded-md">  <!-- var(--radius) = 4px -->
<div class="rounded-lg">  <!-- calc(var(--radius) + 2px) = 6px -->
<div class="rounded-xl">  <!-- calc(var(--radius) + 4px) = 8px -->
```

**Shadow System**:
```vue
<!-- ✅ CORRECT: Use elevation shadows -->
<div class="shadow-sm">       <!-- Elevation 100: Shapes -->
<div class="shadow">          <!-- Elevation 200: Stickies, Comments -->
<div class="shadow-md">       <!-- Elevation 300: Tooltips -->
<div class="shadow-lg">       <!-- Elevation 400: Dialogs -->
<div class="shadow-xl">       <!-- Elevation 500: Modals -->
```

**Layout Constraints**:
```vue
<!-- ✅ CORRECT: Use container constraints -->
<div class="max-w-[var(--container-ui)]">  <!-- 1630px max width -->

<!-- Breakpoints -->
<!-- sms: 22.5rem (360px) - super small screens -->
<!-- Then use standard Tailwind breakpoints: sm, md, lg, xl, 2xl -->
```

**Dark Mode Support**:
```vue
<!-- ✅ CORRECT: Use dark: variant (custom implementation) -->
<div class="bg-gray-100 dark:bg-dark-800">
<p class="text-gray-900 dark:text-gray-100">

<!-- Project uses custom dark mode: @custom-variant dark (&:is(.dark *)) -->
```

**CSS Best Practices**:
1. **Prefer utility classes** over custom CSS
2. **Use design tokens** (color, spacing, typography) instead of arbitrary values
3. **Follow mobile-first** responsive design (use `md:`, `lg:` prefixes)
4. **Maintain consistency** with existing component styling patterns
5. **Use semantic color names** (`primary`, `secondary`, `muted`) for themeable components

### Icon Usage (MANDATORY)

**ONLY use custom icons from `~/assets/cs-icons/`** with the `cs-icon:` prefix:

```vue
<Icon name="cs-icon:icon-name" />
<Icon name="cs-icon:brain-bold" class="w-5 h-5" />
<Icon name="cs-icon:send-bold" size="24px" />
```

**DO NOT use external icon libraries** (mdi:, uil:, heroicons:, etc.). All icons are auto-bundled via `@nuxt/icon` configuration.

**Available icons**: See `.cursor/rules/mdc.md` for the complete list.

### ESLint Rules

**Key formatting rules** (from `eslint.config.mjs`):
- **Quotes**: Single quotes (`'`)
- **Semicolons**: Never (`;` not required)
- **Indentation**: 4 spaces
- **Arrow functions**: Parentheses only when needed (`as-needed`)
- **Vue component order**: `<script>` → `<template>` → `<style>`
- **Vue indentation**: 4 spaces for HTML

**Always run `npm run lint:fix` before committing** (enforced by Husky pre-commit hooks).

### Component Development Patterns

**Composition API Style**:
```vue
<script setup lang="ts">
import { reactive, computed } from 'vue'

// Props with TypeScript
interface Props {
  title?: string
  variant?: 'primary' | 'secondary'
}
const props = defineProps<Props>()

// Reactive state
const state = reactive({ count: 0 })

// Computed
const doubled = computed(() => state.count * 2)

// Methods
const increment = () => state.count++
</script>
```

**TypeScript Types**:
Reference types from `~/types/`:
- `~/types/user.ts` - User enums and interfaces
- `~/types/community.ts` - Community types
- `~/types/agent.ts` - Agent types
- `~/types/activity.ts` - Activity types

### Environment Variables

Access runtime config in components:
```typescript
const config = useRuntimeConfig()
const apiUrl = config.public.appApiUrl
const env = config.public.appEnv  // 'test', 'beta', 'prod'
```

**Environment files**:
- `.env.local` - Local development (not versioned)
- `.env.test` - Test environment
- `.env.beta` - Beta environment
- `.env.prod` - Production

## Special Features & Integrations

### Authentication
- Multi-provider: Email, Phone, Google, Facebook, Twitter, Instagram, Line
- RSA encryption for passwords (`~/utils/rsa.ts`)
- Token management: `ima_token` cookie + header injection
- Device ID tracking (`~/lib/getDeviceId.ts`)
- Anti-fraud: TONGDun integration (`~/lib/getTongdunId.ts`)

### Messaging/IM System
- IndexedDB persistence via Dexie
- EventSource for real-time updates
- State managed in `useIMKitStore()`
- Message components with media support

### Analytics Tracking
- KEWLSensors SDK (`@joyme/sensors-data`)
- Custom tracking functions in `~/lib/track/`
- Page performance metrics in global middleware
- User behavior events

### Media Handling
- Client-side image compression (`browser-image-compression`)
- HEIC format support (`heic-decode`)
- Audio visualization (`wavesurfer.js`)
- Lottie animations with preloading
- Video preview capability

## Deployment & Branching

### BETA Environment Rules
1. **NEVER merge BETA to other branches** (BETA is isolated)
2. **Develop BETA features** from BETA branch only
3. **Merge main → BETA** when needed (force merge, backup BETA first)
4. **Deploy BETA** via git tag: `release-nodejs-beta-YYYYMMDD`
   - Example: `release-nodejs-beta-20250515`
   - C3 build: http://liveme.c3.cmcloud.org/#/quickentry/flowline/48492

### Docker Build
- Multi-stage build (Node 22.14.0 Alpine)
- Package manager: `pnpm`
- Port: 3000
- Dockerfiles: `Dockerfile.dev`, `Dockerfile.beta`, `Dockerfile.online`

## Code Quality & Best Practices

### Pre-commit Workflow
1. Make changes
2. Run `npm run lint:fix` (auto-fixes formatting)
3. Husky hook runs lint-staged on commit
4. Commit succeeds if no errors

### Performance Optimizations
- Code splitting: Vendor chunk for common deps
- Lazy loading: i18n namespaces, pages, components
- Lottie preloading module
- Image compression before upload
- IndexedDB for message caching

### Error Handling
- Global error handling in `app.vue`
- Chunk error detection and recovery
- Toast notifications for API errors
- Private mode detection

## Common Gotchas

1. **MCP Tools**: Always use MCP tools (`mcp__filesystem__*`, `mcp__Framelink_Figma_MCP__*`) when available instead of built-in tools
2. **UI Components**: Check `~/components/ui/` first before creating new components; reuse existing shadcn-nuxt components
3. **Tailwind CSS**: Use design tokens (color, typography, spacing) from `~/assets/tailwind.css` instead of arbitrary values
4. **Design Implementation**: When designs are provided, implement pixel-perfect 1:1 restoration using Figma MCP tools
5. **Icons**: Only use `cs-icon:*` prefix, never external libraries (mdi:, uil:, heroicons:)
6. **i18n**: Always call `useLang(namespace)` before using translations
7. **Indentation**: 4 spaces (not 2) for both TS/JS and Vue templates
8. **Semicolons**: Not required, ESLint enforces their removal
9. **Component names**: Multi-word not required (rule disabled)
10. **Build targets**: ES2016 for broad browser compatibility (Chrome 58+, Safari 11+)
11. **BETA branch**: Isolated workflow, no merges to other branches
