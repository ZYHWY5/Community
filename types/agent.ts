import type { MessageChatMsgData } from '~/composables/useIMKit/types'
import type { IUploadConfigOverride } from '~/types/message'
import type { FormItem as FormItemType } from '~/components/message/components/chat-wrap/chat-send/form/index'
import type { AIRule } from '~/types/ai-creation'

export enum AgentUseTypeEnum {
    Workflow = 'workflow',
    AutoGen = 'autogen',
    DirectModel = 'direct_model',
    Arena = 'arena',
}
export type AgentBadgeType = 'new' | 'hot'
export enum AgentModelTagEnum {
    // 预计耗时
    EstimatedTime = 'EET',
    // 积分范围
    Point = 'point',
}
// 原始数据类型
export type FormItem = FormItemType & {
    formUseId: string // 表单使用ID
    sceneUseId: string // 场景ID
    funcUseId: string // 功能类型ID
    modelUseId: string // 模型ID
}

export type ModelItem = {
    mapId: string // 前端唯一标识
    modelUseId: string // 模型使用ID
    sceneUseId: string // 场景ID
    funcUseId: string // 功能类型使用ID
    key: string // 模型key (model_id)
    name: string // 模型名称
    icon: string // 模型图标
    versionId?: string // 模型版本ID
    badgeType?: AgentBadgeType
    disabled?: boolean
    forms?: FormItem[]
    creditRules?: AIRule[] // 积分规则
    tags?: {
        label: string
        type: AgentModelTagEnum
    }[]
}

export type FuncTypeItem = {
    mapId: string // 前端唯一标识
    funcUseId: string // 功能类型使用ID
    sceneUseId: string // 场景ID
    key: string
    name: string
    placeholder?: string
    icon: string
    badgeType?: AgentBadgeType
    value?: string | number | (string | number)[]
    multiple?: {
        min?: number
        max?: number
        enable?: boolean
    }
    /** 子场景标识，如 '' | 'image' | 'video'（如果不存在则为空字符串 ''） */
    alias?: string
    files?: {
        component?: 'list' | 'start_end_frame' | 'card' // 组件类型 '普通上传组件' | '首尾帧组件' | '卡片组件'
        acceptType?: ('image' | 'video' | 'audio')[] // 接受类型 '图片' | '视频' | '音频'
        acceptTypeIndex?: Record<string | number, ('image' | 'video' | 'audio')[]> // 接受类型索引
        minLimit?: number // 最小数量限制
        maxLimit?: number // 最大数量限制
        config?: IUploadConfigOverride
    }
    models: ModelItem[]
}

/**
 * 子场景类型，作为 AgentModeItem 和 FuncTypeItem 之间的中间层
 */
export type AgentSubScene = {
    /** 子场景标识，如 '' | 'image' | 'video'（可以是空字符串 ''） */
    alias: string
    /** 子场景名称（可选，用于显示） */
    name?: string
}

export type AgentModeItem = {
    scene: string // 场景 image | video | audio | arena
    name: string // 场景名称 Image | Video | Audio | Arena
    agent?: AgentUseTypeEnum
    sceneUseId: string
    icon: string
    iconClass?: string
    badgeType?: AgentBadgeType
    placeholder?: string
    /** 所有功能类型列表（包含 alias 信息） */
    funcType: FuncTypeItem[]
    /** 子场景分组列表（不包含 funcType，只作为分组信息，可能为空数组） */
    subScenes: AgentSubScene[]
}

// 缓存数据类型
export type SceneCacheData = {
    badgeClearList?: string[] // 清除badge的列表
    activeFuncTypeType?: string
    activeModelType?: string[] // 统一为数组类型，单选时为单元素数组，多选时为多元素数组
    /** 保存当前选中的子场景 alias，用于缓存恢复 */
    activeSubSceneAlias?: string
    formValues: {
        formUseId: FormItem['formUseId']
        value: FormItem['value']
    }[]
}

export type AgentModeCache = {
    activeSceneType?: string // 当前选中的场景
    scenes: {
        [sceneUseId: string]: SceneCacheData
    }
}

export type GetAgentModeConfigData = {
    scene: string // 场景 image | video | audio | arena | special_model
    name: string // 场景名称 Image | Video | Audio | Arena | Special Model
    agent?: AgentUseTypeEnum
    badgeType?: AgentBadgeType
    placeholder?: string
    funcType: {
        key: string
        name: string
        placeholder?: string
        icon: string
        alias?: string
        badgeType?: AgentBadgeType
        files?: {
            component?: 'list' | 'start_end_frame' | 'card' // 组件类型 '普通上传组件' | '首尾帧组件' | '卡片组件'
            acceptType?: ('image' | 'video' | 'audio')[] // 接受类型 '图片' | '视频' | '音频'
            acceptTypeIndex?: Record<string | number, ('image' | 'video' | 'audio')[]> // 接受类型索引
            minLimit?: number // 最小数量限制
            maxLimit?: number // 最大数量限制
        }
        /** 多选配置 */
        multiple?: {
            /** 最小选择数量 */
            min?: number
            /** 最大选择数量 */
            max?: number
            /** 是否启用多选 */
            enable?: boolean
        }
        models: {
            key: string // 模型key (model_id)
            name: string // 模型名称
            icon: string // 模型图标
            versionId?: string // 模型版本ID
            badgeType?: AgentBadgeType
            disabled?: boolean
            checked?: boolean
            tags?: {
                label: string
                type: AgentModelTagEnum
            }[]
            creditRules?: AIRule[] // 积分规则
            forms: {
                type: FormItem['type']
                value: string | number // 默认值
                label: string // 默认展示的文本
                mapId: string // 前端唯一标识 (也是 field)
                title?: string // 标题
                placeholder?: string // 默认展示placeholder
                /** 多选配置 */
                multiple?: {
                    /** 最小选择数量 */
                    min?: number
                    /** 最大选择数量 */
                    max?: number
                    /** 是否启用多选 */
                    enable?: boolean
                }
                options: {
                    label: string // 选项展示的文本
                    value: string | number // 选项值
                    disabled?: boolean // 是否禁用
                    /** 禁用关系 */
                    disabledConditions?: {
                        disabledKey: string
                        disabledValue: (string | number)[]
                    }[]
                    badgeType?: AgentBadgeType
                }[]
            }[]
        }[]
    }[]
}

export type createConversationParams = {
    agent?: AgentUseTypeEnum
    func_type?: 'plan' | 'pk' | string // 功能类型
    model_form?: string // 模型表单配置
    prompt: string // 提示词
    user_id: string // 用户ID
}
export type createConversationData = {
    title: string
    conversation_id: string
}
export type getAgentModelsData = {
    imgModels: {
        [key: string]: string
    }
    videoModels: {
        [key: string]: string
    }
}
export type outputSSECoreParams = {
    prompt?: string // 提示词
    conversation_id: string // 会话ID
    template_id?: string // 模板ID
    template_type?: string // 模板类型
    template_model?: string // 模板模型
    user_id?: string // 用户ID
    src_img_url?: string[] // 图片链接数组
    src_video_url?: {
        video_url: string
        cover_url?: string
        duration?: string
    }[] // 视频链接数组
    src_music_url?: string[] // 音频链接数组
    local_msg_id?: string // 本地消息ID
    quick_mode?: 'auto' | 'other' // 快速模式
    model_list?: {
        auto_select: boolean
        image_model?: {
            model_list: {
                model_key: string
            }[]
        }
        video_model?: {
            model_list: {
                model_key: string
            }[]
        }
        audio_model?: {
            model_list: {
                model_key: string
            }[]
        }
    } // 模型列表
    confirmation?: string
    is_retry?: boolean
    // PK 相关参数
    agent?: 'workflow' | 'autogen' | 'direct_model' | 'arena' // 代理类型
    concat_type?: 'image' | 'video'
    func_type?: 'plan' | 'pk' | string // 功能类型
    evaluation_model_list?: string // 模型列表
    model_form?: string // 模型表单配置
}
export type outputSSECoreReplayParams = {
    conversation_id: string // 会话ID
    // last_sequence: string // eventId
}
export type outputSSECoreData = {
    code: number // 状态码 200 成功
    tip: string // 任务状态提示文案
    title: string // 任务标题
    data: MessageChatMsgData['data']
    split: boolean // true需要分段，false不需要分段
}

export type stopConversationTaskParams = {
    user_id: string
    conversation_id: string
}

export type getLibraryListParams = {
    user_id: string
    task_type: 'img' | 'video' | 'audio'
}
export type getLibraryListData = {
    img_total: number
    video_total: number
    audio_total: number
    data: {
        type: 'img' | 'video' | 'audio'
        data: {
            id: number
            msg_id: string
            conversation_id: string
            url: string
            create_at: number
            cover_url?: string
            cover_thumbnail_url?: string
            cover_watermark_url?: string
            video_watermark_url?: string
        }[]
    }
}

export type deleteLibraryResourceParams = {
    id: number
    task_type: getLibraryListParams['task_type']
}

export type changeLikeStatusParams = {
    msg_id: string // Im的消息id，需要的im返回的消息id，不能是前端自定义的msgId
    like_type: 1 | 2 // 1是喜欢，2是不喜欢
    user_id: string
    message?: string
    conversation_id: string
}

export type getConversationTaskStatusParams = {
    conversation_id: string
}
export type getConversationTaskStatusData = {
    status: 'processing' | 'terminate' | 'idle'
}

export type getUserAgentPreferencesData = {
    img_model: {
        model_name: string
        is_select: number
        model_key: string
        icon?: string
        tags?: string[]
    }[]
    video_model: {
        model_name: string
        is_select: number
        model_key: string
        icon?: string
        tags?: string[]
    }[]
    audio_model: {
        model_name: string
        is_select: number
        model_key: string
        icon?: string
        tags?: string[]
    }[]
    auto_execution: 0 | 1 // agent自动模式 1 自动 ; 0 other
    auto_model_preference: 0 | 1 // model 模型自动选择 1 自动; 0 关闭
}

export type updateUserAgentPreferencesParams = Omit<getUserAgentPreferencesData, 'auto_execution'>

export type changePickStatusParams = {
    user_id: string
    msg_id: string
    task_id: string
    task_type: 'img' | 'video'
}
