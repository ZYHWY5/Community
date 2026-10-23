import type { NuxtConfig } from 'nuxt/schema'

export type ScriptTag = NonNullable<NonNullable<NonNullable<NuxtConfig['app']>['head']>['script']>
