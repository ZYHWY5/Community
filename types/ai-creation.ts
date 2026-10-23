import type { IUploadConfigOverride } from '~/types/message'
import type { FormItem as FormItemType } from '~/components/ai-creation/form/components'

export enum TaskTypeEnum {
    IMAGE_TO_VIDEO = 'image_to_video',
    TEXT_TO_VIDEO = 'text_to_video',
    TEXT_TO_IMAGE = 'text_to_image',
    IMAGE_TO_IMAGE = 'image_to_image',
    FIRST_LAST_FRAME_TO_VIDEO = 'first_last_frame_to_video',
}
export interface getProductListParams {
    category: TaskTypeEnum
}
export type getProductListData = AIModel

export type getModelInfoData = AIModelMeta

export interface createAiTaskParams {
    task_type: TaskTypeEnum
    enable_multi_model: boolean
    src_img_url: string[]
    parameters: {
        app: string
        platform: string
        category: TaskTypeEnum
        model_id: string
        model_name: string
        model_version: string
        attribute_id: number
        credit: number
        parameters: {
            input_images: string[]
            prompt: string
            cast: {
                points: number
                attribute_id: number
            }
            [key: string]: any
        }
    }[]
}

export type createAiTaskData = {
    [key: string]: any
}
export interface AIModel {
    /** 分类标识 */
    category_code: string
    /** 分类名称 */
    category_name: string
    /** 积分规则 */
    creditRules: AIRule[]
    /** 描述 */
    description: string
    /** 表单配置 */
    formConfig: AIFormConfig[]
    /** 模型icon */
    model_icon: string
    /** 模型id */
    model_id: string
    /** 模型类型 */
    model_type: string
    model_types: string[]
    /** 模型名称 */
    title: string
    /** 模型名称  */
    name: string
    /** 标签 */
    tags?: string[]
    /** 不知道是啥 */
    version_id: string
    /** 不知道是啥 */
    disabledEndFrame?: Record<string, any>
}

export interface AIModelMeta {
    icon: string
    model_id: string
    model_name: string
    model_type: string
    description: string
}

// 动态表单样式
export type FormItemStyle = 'radio' | 'toggle' | 'tabs' | 'slider' | 'cards' | 'seed' | 'textarea' | 'tags'

// 动态表单
export interface AIFormConfig {
    type: FormItemStyle
    field: string
    label: string
    value: any // 默认值
    options?: {
        label: string
        value: any
        disabled?: {
            [key: string]: (string | number)[]
        }
        reset?: {
            [key: string]: [(string | number)[], string | number]
        }
        [key: string]: any
    }[]
    config?: Record<string, any>
}

export type AIRuleKV = Pick<AIRule, 'attribute_id' | 'points'>

export type AIFormData = {
    input_images: string[]
    prompt: string
    [key: string]: any
}

export enum MediaStatus {
    PENDING = 'pending', // 任务未发起成功，前端不做处理
    PROCESSING = 'processing',
    SUCCESS = 'success',
    FAILED = 'failed',
}

export enum FavStatus {
    LIKE = 'like',
    DISLIKE = 'dislike',
    CANCEL = 'cancel',
}

export enum TaskItemAction {
    PREFERHOVER = 'preferHover',
    PREFERCLICK = 'preferClick',
    LIKE = 'like',
    DISLIKE = 'dislike',
    PUBLISH = 'publish',
    DELETE = 'delete',
    RETRY = 'retry',
    DOWNLOAD = 'download',
    REMAKE = 'remake',
}

export enum MediaType {
    VIDEO = 'video',
    IMAGE = 'image',
    AUDIO = 'audio',
}

export type TaskFlowMediaItem = {
    id: string
    type: MediaType
    status: MediaStatus
    src_img_url: string[] // 上传图片
    duration: number // 视频时长
    estimatedTime: string // 预计耗时
    fav_status?: FavStatus // 点赞点踩状态
    cover?: string // 封面
    src: string // 资源地址
    ai_watermark?: string // 生图，水印图
    thumbnail?: string // 缩略图
    width?: number
    height?: number
    mode_name: string // 模型名称
    model_id: string // 模型ID
    parameters?: AIFormData
    resource_biz_id: string
    [key: string]: any
}

// 任务流区域数据结构
export type TaskFlowItem = {
    id: string
    renderKey: string // 用于前端渲染
    generateCount: number // 生成数量
    title: string
    prompt: string
    fav_resolution: string // 用户偏好结果
    src_img_url: string[] // 上传图片
    task_type: TaskTypeEnum
    medias: TaskFlowMediaItem[]
    [key: string]: any
}

export enum APIErrorCode {
    NoAuthToken = 10002,
}

export type APIError = {
    msg: string
    status: APIErrorCode
}

export type NavItem = {
    name: string
    icon: string
    path: string
}

// ============ Agent Mode Types (从 agent.ts 迁移) ============

// Agent 使用类型枚举
export enum AiCreationAgentUseTypeEnum {
    Workflow = 'workflow',
    AutoGen = 'autogen',
    DirectModel = 'direct_model',
    Arena = 'arena',
}

// 模型标签类型枚举
export enum AiCreationAgentModelTagEnum {
    EstimatedTime = 'EET', // 预计耗时
    Point = 'point', // 积分范围
}

// 徽章类型
export type AiCreationAgentBadgeType = 'new' | 'hot'

// 表单项类型
export type AiCreationFormItem = FormItemType & {
    formUseId: string // 表单使用ID
    sceneUseId: string // 场景ID
    funcUseId: string // 功能类型ID
    modelUseId: string // 模型ID
}

// 模型项类型
export type AiCreationModelItem = {
    mapId: string // 前端唯一标识
    modelUseId: string // 模型使用ID
    sceneUseId: string // 场景ID
    funcUseId: string // 功能类型使用ID
    key: string // 模型key (model_id)
    name: string // 模型名称
    icon: string // 模型图标
    versionId?: string // 模型版本ID
    badgeType?: AiCreationAgentBadgeType
    disabled?: boolean
    forms?: AiCreationFormItem[]
    creditRules?: AIRule[] // 积分规则
    tags?: {
        label: string
        type: AiCreationAgentModelTagEnum
    }[]
    modeTypes?: string[] // 模型支持的特殊模式类型数组
}

// 功能类型项
export type AiCreationFuncTypeItem = {
    mapId: string // 前端唯一标识
    funcUseId: string // 功能类型使用ID
    sceneUseId: string // 场景ID
    key: string
    name: string
    placeholder?: string
    icon: string
    badgeType?: AiCreationAgentBadgeType
    value?: string | number | (string | number)[]
    multiple?: {
        min?: number
        max?: number
        enable?: boolean
    }
    alias?: string // 子场景标识，如 '' | 'image' | 'video'
    files?: {
        component?: 'list' | 'start_end_frame' | 'card' | 'single'
        acceptType?: ('image' | 'video' | 'audio')[]
        acceptTypeIndex?: Record<string | number, ('image' | 'video' | 'audio')[]>
        minLimit?: number
        maxLimit?: number
        config?: IUploadConfigOverride
    }
    models: AiCreationModelItem[]
}

// 子场景类型
export type AiCreationAgentSubScene = {
    alias: string // 子场景标识，如 '' | 'image' | 'video'
    name?: string // 子场景名称（可选，用于显示）
}

// Agent 模式项
export type AiCreationAgentModeItem = {
    scene: string // 场景 image | video | audio | arena
    name: string // 场景名称 Image | Video | Audio | Arena
    agent?: AiCreationAgentUseTypeEnum
    sceneUseId: string
    icon: string
    iconClass?: string
    badgeType?: AiCreationAgentBadgeType
    placeholder?: string
    funcType: AiCreationFuncTypeItem[] // 所有功能类型列表（包含 alias 信息）
    subScenes: AiCreationAgentSubScene[] // 子场景分组列表（不包含 funcType）
}

// API 响应数据类型
export type AiCreationGetAgentModeConfigData = {
    scene: string
    name: string
    agent?: AiCreationAgentUseTypeEnum
    badgeType?: AiCreationAgentBadgeType
    placeholder?: string
    funcType: {
        key: string
        name: string
        placeholder?: string
        icon: string
        alias?: string
        badgeType?: AiCreationAgentBadgeType
        files?: {
            component?: 'list' | 'start_end_frame' | 'card' | 'single'
            acceptType?: ('image' | 'video' | 'audio')[]
            acceptTypeIndex?: Record<string | number, ('image' | 'video' | 'audio')[]>
            minLimit?: number
            maxLimit?: number
        }
        multiple?: {
            min?: number
            max?: number
            enable?: boolean
        }
        models: {
            key: string
            name: string
            icon: string
            versionId?: string
            badgeType?: AiCreationAgentBadgeType
            disabled?: boolean
            checked?: boolean
            tags?: {
                label: string
                type: AiCreationAgentModelTagEnum
            }[]
            creditRules?: AIRule[]
            modeTypes?: string[] // 模型支持的特殊模式类型数组
            forms: {
                type: AiCreationFormItem['type']
                value: string | number
                label: string
                mapId: string
                title?: string
                placeholder?: string
                multiple?: {
                    min?: number
                    max?: number
                    enable?: boolean
                }
                options?: {
                    label: string
                    value: string | number
                    disabled?: boolean
                    disabledConditions?: {
                        disabledKey: string
                        disabledValue: (string | number)[]
                        resetValue?: string | number
                    }[]
                    badgeType?: AiCreationAgentBadgeType
                    icon?: string
                    versionId?: string
                }[]
                config?: {
                    unit?: string
                    maximum?: number
                    minimum?: number
                    tooltip?: string
                }
            }[]
        }[]
    }[]
}

// 场景缓存数据类型
export type AiCreationSceneCacheData = {
    badgeClearList?: string[] // 清除badge的列表
    activeFuncTypeType?: string
    activeModelType?: string[] // 统一为数组类型
    activeSubSceneAlias?: string // 保存当前选中的子场景 alias
    formValues: {
        formUseId: AiCreationFormItem['formUseId']
        value: AiCreationFormItem['value']
    }[]
}

// Agent 模式缓存类型
export type AiCreationAgentModeCache = {
    activeSceneType?: string // 当前选中的场景
    scenes: {
        [sceneUseId: string]: AiCreationSceneCacheData
    }
}

// 价格规则
export interface AIRule {
    points: number
    attribute_id: number | string
    attributes: Record<string, any>
}

// ============ Task Detail Types ============

/**
 * 获取任务详情 - 请求参数
 */
export interface getTaskDetailParams {
    task_id: string | number
}

/**
 * 任务详情中的媒体资源项
 */
export interface TaskDetailMediaItem {
    category?: TaskTypeEnum // 任务类型
    id?: string // 资源ID
    type?: string // 资源类型
    status?: string // 资源状态
    duration?: number // 时长（秒）
    estimated_time?: string // 预计完成时间
    fav_status?: string | null // 收藏状态
    like_status?: number // 点赞状态（0=点赞，1=点踩）
    dislike_status?: number // 点踩状态
    cover?: string // 封面URL
    src?: string // 资源URL
    url?: string // 媒体URL（扁平化字段）
    thumbnail?: string // 缩略图URL
    watermark_url?: string // 水印URL
    mode_name?: string // 模式名称
    model_id?: string // 模型ID
    model_icon?: string // 模型图标URL
    prompt?: string // 提示词
    width?: number // 宽度
    height?: number // 高度
    ai_watermark?: string // AI水印URL
    parameters?: Record<string, any> // 参数JSON对象
    metadata?: {
        id_task?: string
        results?: Array<{
            url?: string
            text?: string | null
            width?: number
            height?: number
            duration?: number | null
            content_type?: string
            watermark_url?: string
            first_frame_url?: string | null
        }>
        task_msg?: string | null
        finish_at?: number
        task_code?: number
        task_status?: string
    }
}

/**
 * 获取任务详情 - 响应数据
 */
export interface getTaskDetailData {
    id?: string // 任务ID
    title?: string // 任务标题
    task_type?: string // 任务类型
    content?: string // 任务内容
    prompt?: string // AI提示词内容
    biz_id?: string // 任务业务ID
    fav_resolution?: string | null // 收藏分辨率
    upload_img_src?: string // 上传图片URL
    src_img_url?: string[] // 源图片URL列表
    generate_count?: number // 生成数量
    medias?: TaskDetailMediaItem[] // 媒体资源列表
    created_at?: string // 创建时间（ISO格式字符串）
    timeout_at?: string // 超时时间（ISO格式字符串）
}
