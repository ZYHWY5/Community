import type { UserRoleEnum } from '~/types/user'

export type ArenaVideo = {
    cover: string
    completedAt: string | null
    status: string | null
    duration: number | null
    qualityScore: number | null
    isWinner: boolean | null
    task_id: string
    task_result: string
    model: string
    url: string
    vote_count: number
}

export type ArenaData = {
    evaluation_id: string
    platform: string
    task_type: string
    evaluation_status: string
    user_id: string
    user_name: string
    user_type: string
    created_at: string
    updated_at: string
    prompt: string
    can_vote: boolean
    has_voted: boolean
    user_voted_task_id: string | null
    vote_cnt: number
    vote_task_id: string | null
    total_videos: number
    videos: ArenaVideo[]
    execution_time_ms: number
    is_random_selected: boolean
    data_source: string
    query_time: number
    has_next: boolean
}

export type TopContributors
    = {
        rank: number
        contributor: string
        user_name: string
        user_type: string
        total_prompts_contributed: number
        total_votes: number
        elo: number
        ci95: number
        score: number
        evaluation_id: string
    }

export type MiniArenaData
    = {
        pageNum: number
        pageSize: number
        total: number
        totalPages: number
        data: MiniArenaMedia[]
        hasNext: boolean
        hasPrevious: boolean
        empty: boolean
        endIndex: number
        dataSize: number
        startIndex: number
        validPage: boolean
        firstPage: boolean
        lastPage: boolean
    }

export type MiniArenaMedia = {
    battleId: string // 生成的对战ID 用于标识本次对战的唯一标识符
    modelName: string // 模型名称（单个任务的模型）
    contentType: string // 内容类型（img/video）
    imaArenaVotes: number // IMA Arena平台投票数
    totalVotes: number // 总投票数
    conversationId: string // 会话ID
    conversationName: string // 会话名称
    srcImgUrlList: string[] // 原图片URL列表（使用TypeHandler处理）
    funcType: string // 功能类型（与 PkTaskMessage 对应）
    userId: string // 用户ID（创建者ID，与 PkTaskMessage 对应）
    appId: string // 应用ID（与 PkTaskMessage 对应）
    platform: string // 平台标识（与 PkTaskMessage 对应）
    prompt: string // 提示词（与 PkTaskMessage 对应）
    contents: MiniMediaData[] // 内容数组
    battleType: string // 对战类型 img/video，表示本次对战的内容类型
    totalBattles: number // 总对战数量 当前可用的对战内容总数
    can_vote: boolean // 是否可以投票
    vote_task_id: string // 投票任务ID
    nickname: string // 用户名称
    avatar: string // 用户头像
    creatorStatus: UserRoleEnum // 用户角色
}
export type MiniMediaData = {
    id?: number // 数据库主键ID，实体的唯一标识
    pkId?: string // PK ID，PK任务的唯一标识
    taskId?: string // 任务ID，对应PK内容的唯一标识
    funcType?: string // 功能类型，任务的功能分类
    userId?: string // 用户ID，创建该内容的用户标识
    contentUrl?: string // 内容URL，图片或视频的访问地址
    modelName?: string // 模型名称，生成该内容的AI模型名称
    contentType?: string // 内容类型，img/video
    totalVotes?: number // 总投票数，该内容获得的总投票数
    prompt?: string // 提示词，生成该内容使用的提示词
    targetText?: string // 目标文本，任务的目标文本内容
    language?: string // 语言，内容的语言设置
    conversationId?: string // 会话ID，所属的会话标识
    parentTaskId?: string // 父任务ID，父级任务的标识
    mediaResources: MediaResourcesData[]
    vote_count: number // 投票数
    type: number // 类型，1: 图片，2: 视频

}

type MediaResourcesData = {
    type: number
    url: string
    watermark_url: string
    height: string
    width: string
    task_id: string
    status: string
    cover: string
}
