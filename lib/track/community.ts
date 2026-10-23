import { track } from '.'
import type { TrackOption } from '.'

/**
 * 上报社区的行为
 */
type TrackTryThisStyleParams = TrackOption & {
    cid: string
    creator_id: string
}

type TrackDetailsPageParams = TrackOption & {
    f_page: 'webhome'
    btn_position: 'content_detail'
    btn_name: 'content_expo' | 'share_click' | 'copy_click'
    cid: string
    creator_id?: string
}

type TrackTemplateClickParams = TrackOption & {
    f_page: 'template_share'
    btn_position: 'content_card' | 'content_detail' | 'webhome'
    btn_name: 'try_click' | 'send_click_fromtry'
    cid: string
    conversation_id?: string
    creator_id?: string
}

export type TrackSidebarClickParams = {
    f_page: 'webhome'
    btn_position:
      | 'home'
      | 'create_with_ima'
      | 'banner'
      | 'tag'
      | 'join_discord'
      | 'follow_onx'
      | 'content_card'
      | 'create_with_pro_tool'
      | 'avatar'
      | 'points_information'
      | 'try_on_discord'
      | 'event_center'
      | 'ima_arena'
      | 'ima_library'
      | 'ima_pro'
      | 'ai_creation'
    btn_name: 'click' | 'expo' | 'search_click' | 'post_click'
    tag_id?: string
    banner_id?: string
    conversation_id?: string
    cid?: string
}

export function trackTryThisStyle(params: Pick<TrackTryThisStyleParams, 'btn_position' | 'btn_name' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'template_share',
        ...params,
    })
}

// 详情页曝光
export function trackDetailsPage(params: Pick<TrackDetailsPageParams, 'btn_name' | 'cid' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'content_detail',
        ...params,
    })
}

// 用户模版点击
export function trackTemplateClick(params: Pick<TrackTemplateClickParams, 'btn_position' | 'btn_name' | 'cid' | 'conversation_id' | 'creator_id'>) {
    track('ima_function_click', {
        f_page: 'template_share',
        ...params,
    })
}

// 侧边栏点击上报
export function trackSidebarClick(params: Pick<TrackSidebarClickParams, 'btn_position' | 'btn_name' | 'tag_id' | 'banner_id' | 'cid'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        ...params,
    })
}

// 点击搜索上报
export function trackSearchClick(params: Pick<TrackSidebarClickParams, 'btn_name' | 'cid'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'home',
        ...params,
    })
}
// 点击post
export function trackPostClick(params: Pick<TrackSidebarClickParams, 'btn_name' | 'cid'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'home',
        ...params,
    })
}

/**
 * .track("kewlweb_Imsite", {
    f_page: "1v1_page",
    btn_position: "webtab",
    btn_name: "click",
    params: JSON.stringify({
      source,
    }),
  });
}
**/
