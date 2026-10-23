import type { MessageChatMsgData } from '~/composables/useIMKit/types'

export type SendTextMessageParams = {
    // 发送id
    sid: string
    // 接收消息uid
    rid: string
    content: string
}
export type SendGiftMessageParams = {
    giftId: string
    rid: string
    type: 'bag' | 'balance' // 201-账户余额礼物 202-背包礼物
    moneyType: 'gold' | 'star' | 'diamond' // 101-金币礼物 102-星光礼物  103-钻石
}
export type SendTextMessageData = {
    msg: string
    code: number
}

export type SendMediaMessageParams = {
    url: string
    extra: SendMediaMessageExtraParams
    rid: string // 接收消息uid
    type: 'image' | 'video' // 消息类型
    sid: string // 发送id
}

export type SendMediaMessageExtraParams = Pick<
    MessageChatMsgData['data'],
    'text' | 'images' | 'videos' | 'audios' | 'extra'
>
export interface GetUnReadMessageParams {
    uid: string // String true 用户标识
    sequence?: string | number // long false 客户端消息的顺序
    msgId?: string // string false 客户端最新消息标识
    count?: number // int false 客户端拉去的消息条数，最大20条
    time?: string | number // long false 客户端拉去消息的时间戳
    sessionId?: string // long false 客户端拉去消息的时间戳
}
export interface GetUnReadMessageData {
    msgs: {
        appId: string
        bizStatus: number
        cMsgId: number
        clientTime: number
        content: string
        deviceId: string
        deviceType: number
        extend1: string
        extend2: string
        extend3: string
        extend4: string
        extend5: string
        extend6: string
        flag: string
        from: string
        msgId: string
        sequence: string
        serverTime: number
        subType: number
        title: string
        to: string
        type: string
    }[]
    unReadNum: number
}

export interface GenerateUploadInfoParams {
    uid: string
    type: 'video' | 'image' | 'audio'
    suffix?: string
    plat?: 'oss' | 'aws' | 'wcs'
}
export interface GenerateUploadInfoData {
    ful_expire: string
    fdl_key: string
    fdl_expire: string
    imargs: string
    ful: string
    fdl: string
}

/**
 * WCS 上传 Token 响应数据
 */
export type GetWCSUploadTokenData = {
    /** WCS 上传凭证，WCS 上传时在 Authorization header 中使用 */
    token: string
    /** WCS 上传服务器地址，客户端直接上传的目标 URL */
    upload_url: string
    /** 文件唯一标识符，文件在 WCS 中的路径和名称 */
    key: string
    /** 文件下载 URL，上传完成后使用此 URL 下载文件 */
    fdl: string
    /** MIME 类型，基于文件后缀自动生成，客户端不需要但可用于调试 */
    content_type?: string
}

export interface SendACKMessageParams {
    uid: string
    sequence: string
}
export interface UpdateUserBlackStateParams {
    uid: string
    black: boolean // true=>拉黑 false取消拉黑
}
export interface GetGiftListWithIMData {
    danmakuGold: string // #付费弹幕价格
    countryCode: string //
    area: string // #该礼物列表对应地区
    dataList: {
        id: string // 礼物id
        name: string // #礼物名称~
        gold: string // #礼物价值~
        status: string //
        order: string //
        rain: string //
        img: string // #礼物静态图~
        tab: string //
        animationType: string // #动画类型~
        levelRequired: string // #需要等级~
        lockType: string // #对应老版isVIPGift 1 等级礼物; 2 vip礼物;3 普通守护礼物;4 至尊守护礼物;5 粉丝团礼物;6 吃货游戏礼物;7 白名单礼物;8 黑名单礼物
        giftImage: string // #礼物托盘动态webp
        tagContent: string // #标签文案
        sceneType: string // #礼物使用场景： 1-直播间；2-私信；3-短视频
        finanType: string // #礼物类型： 101 金币礼物；102 星光礼物
        sourceType: string // #礼物消费类型： 201 走账户余额礼物类型； 202 走背包礼物
        previewUrl: string // #预览url
        tipContent: string // #预览时的文案
        resourceUrl: string // #资源url,
        expAdd: string // #经验
        diamondAdd: string // #该礼物给主播增加钻石数
        clickStyle: string //
        tagUrl: string // #标签背景图
    }[]
}
export interface GetBagGiftListWithIMData {
    cnt: string //
    min_expr: string // 剩余过期时间
    item_id: string // 礼物id
    type: string // 0表示金币礼物，1表示属性
    created_at: string //
    item_info: {
        // item详情，此处表示礼物详情
        id: string //
        area: string //
        name: string //
        gold: string //
        status: string //
        order: string //
        level: string //
        scene_type: string //
        finan_type: string //
        source_type: string //
        effect: string //
        rain: string //
        img: string //
        res_id: string //
        gift_img: string //
        tab: string //
        piece_limit: string //
        bag_only: string //
        task: string //
        ver: string //
        up_timer: string //
        down_timer: string //
        tag: string //
        tag_txt: string // "文案";
        gift_des: string // "礼物文案";
        piece_img: string //
        rule: string //
        global: string //
        tag_url: string //
        lock_type: string //
        rebate_id: string //
        rebate_gold: string //
        old_gold: string //
        rebate_exp: string //
        start_time: string //
        end_time: string //
        previewUrl: string //
        clickStyle: string //
        expAdd: string //
        giftImage: string //
        send_num: string[] //
    }
}
export interface GetUserProfileData {
    [key: string]: any
    user_info: {
        uid: string
        nickname: string
        sex: string
        countryCode: string
        birthday: string
        usign: string
        is_verified: string
        verified_info: string
        short_id: string
        reg_type: string
        face: string //
        big_face: string //
        worn_badge: string //
        diamond: string //
        share_url: string //
        user_tag: string //
        project: string //
        sns_id: string //
        emotional_state: string //
        nft_subscribe_status: string //
        nft_wallet_bind_status: string //
        nft_show: string //
        nft_id: string //
        nft_avatar: string //
        nft_avatar_frame: string //
        is_nft: string //
        is_show_diamond: string //
        is_show_gold: string //
        has_goldcard: string //
        has_goldcard2: string //
        project_url: string //
        age: string //
        level: string //
        anchor_level: string //
        showfont: string //
        exclusiveCs: string //
        anchor_level_name: string //
        virtual_big_picture: string //
        virtual_picture: string //
        work_list: string //
        school_list: string //
        is_relation: string //
        isblock: string // 1 他拉黑了我
        blockState: string // 1 我拉黑了他
        is_online: string //
        status: string // 0直播中 1在线 2离线
    }
}
export interface GetUserProfileAllData {
    liveList: {
        face: string //
        hostvid: string //
        is_nft: string //
        is_story_ring: string //
        nickname: string //
        sex: string // 0女 1男 -1未知
        status: string // 0直播中 1在线 2离线
        uid: string //
        vid: string //
        videoid: string //
    }[]
}

export interface GetMessageHistoryFullListParams {
    userId: string
    count: number
    startTime?: string
    endTime?: string
    pageNum: number
}
export interface GetMessageHistoryFullListData {
    msgJsons: GetUnReadMessageData['msgs']
    msgNum: number
    msgTotalNum: number
}
