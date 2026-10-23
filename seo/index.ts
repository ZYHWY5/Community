import { baseSeoMeta } from './base'
import type { ISeoMeta } from './base'
import appSeoMeta from './app'
import hubSeoMeta from './hub'

const indexSeoMeta: ISeoMeta = {
    ...baseSeoMeta,
}

const detailsSeoMeta: ISeoMeta = {
    ...baseSeoMeta,
    title: 'Template Details - Ima Studio',
    description: 'Explore detailed template information and try this AI generation style',
}

export const seoMetaMap = {
    default: baseSeoMeta,
    index: indexSeoMeta,
    home: indexSeoMeta,
    app: appSeoMeta,
    hub: hubSeoMeta,
    details: detailsSeoMeta,
}
