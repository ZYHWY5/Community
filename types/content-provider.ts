import type { ImageData } from '~/composables/useSimpleMasonry'
import type { UserRoleEnum } from '~/types/user'
import type { ResourceType } from '~/components/profile/useVisitorInfoStore'
import type { VoteSortType } from '~/components/activity/campaign/useMit'
/**
 * 媒体类型枚举
 */
export enum ContentTypeEnum {
    Image = 'img',
    Video = 'video',
    Audio = 'audio',
}
export enum ContentSourceEnum {
    Ima = 'ima',
    CreVibe = 'crevibe',
}

export enum ContentGroupTypeEnum {
    Normal = 'normal',
    Group = 'group',
}

/**
 * 内容发布类型枚举
 */
export enum ContentPostTypeEnum {
    /** 官方发布 */
    Official = 0,
    /** 用户发布 */
    User = 1,
    /** 用户发布-不能用作模版 */
    UserNoTemplate = 2,
}

export enum AttributeEnum {
    Topic = 0,
    Tag = 1,
}
export enum AttributeTypeEnum {
    Normal = 0,
    Activity = 1,
    Custom = 2,
}

/*
* 搜索类型枚举
*/
export enum searchTypeEnum {
    /** 按内容搜索 */
    content = 1,
    /** 按用户搜索 */
    user = 2,
}

/**
 * 基础媒体项目字段（所有类型共有）
 */
export interface BaseContentItem extends ImageData {
    /** 项目索引 */
    index: number
    /** 唯一标识键 */
    key: string
    /** 项目ID */
    id: string
    /** 描述信息 */
    desc: string
    /** 内容发布类型 */
    postType: ContentPostTypeEnum
    groupType: ContentGroupTypeEnum
    contentList: {
        id: string
        url: string // 资源地址
        watermark: string // 水印地址
        thumb: string // 缩略图地址
        cover: string // 封面地址
        thumbCover: string // 缩略图地址
        watermarkCover: string // 水印地址
        width: number // 原始宽度
        height: number // 原始高度
        prompt: string
        referenceImgs: string[]
        referenceModels: string[]
        referenceCnt: number
        type: ContentTypeEnum
        duration?: number
    }[]
    user: {
        id: string
        name: string
        avatar: string
        role: UserRoleEnum
        level: number
    }
    topics: {
        id: string
        name: string
        type: AttributeTypeEnum
        useDetailId?: string
    }[]
    tags: {
        id: string
        name: string
        type: AttributeTypeEnum
        useDetailId?: string
    }[]
    likeCount: number
    likeCountStr: string
    likeStatus: boolean
    isTemplate: boolean
    publishTime: string
    publishTimeText: string
    isLiked: boolean
    referenceCnt: number
    seoTitle: string
    seoDescription: string
    seoAlt: string
    voteCount: number
    voteCountStr: string
    voteStatus: boolean
    source: ContentSourceEnum
    postCount: number
    awardType: string
    pinnedAt: string | null
}

/**
 * Hub项目联合类型 - 根据type字段区分不同的媒体类型
 */
export type ContentItem = BaseContentItem

export type GetContentTopicParams = {
    sceneCode: 'index' | 'hub' | 'community' | 'app' | 'activity_campaign01' | 'inspirations' | 'shorts' // 场景编码 activity_campaign01-mit活动 inspirations-灵感
    attribute?: AttributeEnum
    attributeType?: AttributeTypeEnum
}
export type ContentTopicData = {
    id: string // 非必须 主题ID
    parentId: string // 非必须 父级分类ID
    lang: string // 非必须 语言标识
    name: string // 非必须 名称
    hashKey: string // 非必须 分类哈希键
    platform: string // 非必须 平台标识
    topicOrder: number // 非必须 排序权重
    attribute: AttributeEnum // 非必须 属性(0:category分类 1:tag标签)
    attributeType: AttributeTypeEnum // 非必须 属性类型(0:官方 1:活动 2:自定义)
    isOnline: number // 非必须 上线状态
    createdBy: string // 非必须 创建人
    createdAt: string // 非必须 创建时间
    updatedBy: string // 非必须 更新人
    updatedAt: string // 非必须 更新时间
    isDel: boolean // 非必须 删除标记
    activityId?: string // 非必须 活动ID
}[]

/**
 * 获取场景下的所有主题及其子主题树形结构参数
 */
export type GetSceneListAllTopicsParams = {
    /** 场景编码 */
    sceneCode: GetContentTopicParams['sceneCode']
    /** 是否排除tag类型的topic，默认false */
    excludeTag?: boolean
}

/**
 * 主题树形结构数据项
 */
export type SceneTopicTreeItem = {
    /** 主题ID */
    id: number
    /** 父级分类ID */
    parentId: number
    /** 语言标识 */
    lang: string
    /** 名称 */
    name: string
    /** 分类哈希键 */
    hashKey: string
    /** 平台标识 */
    platform: string
    /** 排序权重 */
    topicOrder: number
    /** 属性(0:topic类型 1:tag类型) */
    attribute: number
    /** 属性类型(0:官方 1:活动 2:自定义) */
    attributeType: number
    /** 上线状态 */
    isOnline: number
    /** 是否默认选中 */
    isDefault: number
    /** 活动ID */
    activityId: number
    /** 创建人 */
    createdBy: string
    /** 创建时间 */
    createdAt: string
    /** 更新人 */
    updatedBy: string
    /** 更新时间 */
    updatedAt: string
    /** 模型标识(逗号分隔) */
    models: string[]
    /** 媒体类型 */
    mediaType: string
    /** 子主题列表 */
    children: SceneTopicTreeItem[]
}

/**
 * 获取场景下的所有主题及其子主题树形结构响应
 * 注意：只定义 data 字段的结构，code 和 message 不需要定义
 */
export type GetSceneListAllTopicsData = SceneTopicTreeItem[]

export type GetContentListParams = {
    topicId?: string // 非必须 主题ID
    pageNum: number // 非必须 页码
    pageSize: number // 非必须 每页大小
    isTemplate?: boolean // 非必须 是否为模板
    isVote?: boolean // 非必须 是否为投票
    userId?: string // 非必须 用户ID 调用该字段查询特定用户的作品
    postTypes?: ContentPostTypeEnum[] // 非必须 内容发布类型
    resourceType?: ResourceType // 非必须 资源类型
    voteType?: VoteSortType
    activityId?: string // 非必须 活动ID
    isWinners?: boolean // 非必须 是否为获奖作品
    isMyLikes?: boolean // 非必须 是否为我的点赞
    isPersonalHome?: boolean // 非必须 是否为个人主页
    sortBy?: 'DEFAULT' | 'LATEST' // 非必须 排序方式
    topicIds?: number[]
}
export type SearchContentListParams = {
    topicId?: string // 非必须 主题ID
    page: number // 非必须 页码
    size: number // 非必须 每页大小
    keyword: string // 非必须 关键词
    searchType?: searchTypeEnum // 非必须 搜索类型 枚举备注: 1 :按内容搜索（默认搜索模式）编码值：1 keyword含义：内容全文搜索关键词（搜索标题、描述等内容字段）2 :按用户搜索 编码值：2 keyword含义：用户名（模糊搜索）或用户ID（精确搜索） 客户端根据输入内容自行判断搜索方式
}

export type GetContentListDataItem = {
    resourceType: ContentTypeEnum
    groupId: string
    sourceId: string
    sourceChannel: string
    description: string
    sortOrder: number
    lang: string
    platform: string
    topics: ContentTopicData
    tags: string[]
    userId: string
    userName: string
    userAvatar: string
    heatValue: number
    creatorStatus: UserRoleEnum
    creatorTier: number
    publishTime: string
    hasPostDisplay: boolean
    isMyPost: boolean
    isOnline: boolean
    referId: string
    source: string
    postType: number// 0: 官方发布 1: 用户发布 2: 用户自定义发布-不能用作模版
    likeCnt: number
    viewCnt: number
    commentCnt: number
    referenceCnt: number
    isLiked: boolean
    isPlatformTop: boolean
    isAudit: boolean
    isTemplate: boolean
    postCount: number
    seo: {
        seoTitle: string
        seoDescription: string
        seoAlt: string
    }
    isVote: boolean
    voteCnt: number
    posts: {
        id: string // 非必须 模版ID
        sourceId: string // 非必须 来源标识
        cover: {
            url: string
            width: number
            height: number
            thumbnailUrl: string
        } // 非必须 封面内容
        prompt: string // 非必须 提示词描述
        referenceImgs: string[] // 非必须 参考图片URL列表
        referenceModels: string[] // 非必须 参考模型列表
        referenceScene: string // 非必须 参考场景
        content?: ContentImageModel[] | ContentVideoModel[]
        extra: string // 非必须 额外信息
        referId: string // 非必须 关联ID（引用其他内容）
        referenceCnt: number // 非必须 引用数量
    }[]
    awardType: string
    pinnedAt: string | null
}
/**
 * API 返回的分类列表数据类型
 */
export type GetContentListData = {
    list: GetContentListDataItem[]
    total: number
    page: number
    pageSize: number
    isPersonalHome?: boolean
}

export type ContentImageModel = {
    imgUrl: string // 图片URL
    width: number // 图片宽度
    height: number // 图片高度
    fileSize: number // 文件大小（字节）
    fileType: string // 文件类型
    thumbnailUrl: string // 缩略图URL
    thumbnailWidth: number // 缩略图宽度
    thumbnailHeight: number // 缩略图高度
}

export type ContentVideoModel = {
    videoUrl: string // 视频URL
    width: number // 视频宽度
    height: number // 视频高度
    duration: number // 视频时长（毫秒）
    fileSize: number // 文件大小（字节）
    fileType: string // 文件类型
    thumbnailUrl: string // 缩略图URL
    thumbnailWidth: number // 缩略图宽度
    thumbnailHeight: number // 缩略图高度
    videoCodec: string // 视频编码
    audioCodec: string // 音频编码
    previewUrl: string // 预览URL
    previewDuration: number // 预览时长（毫秒）
}

export type GetContentDetailParams = {
    id: number | string
}

export type GetContentDetailData = GetContentListData['list'][number] & {
    type: ContentTypeEnum
    // 有特殊的再补
}

// 遗留的数据，这部分等功能重启需要重新命名，不用管这里
export type TemplateInfo = {
    cover: string
    cover_height: number
    cover_width: number
    prompt: string
    reference_imgs: string[]
    reference_models: string[]
    reference_sence: string
    video_demo: string
}
export type GetTemplateCategoryData = {
    categories: {
        id: number
        language: string
        hash_key: string
        plat_form: string
        category_name: string
        category_order: number
        task_type: string
        is_online: number
        created_by: string
        created_at: string
        updated_by: string
        updated_at: string
    }[]
    total: number
}

export type GetTemplateListData = {
    templates: GetContentDetailData[]
    total: number
}
