import { track } from '.'
import type { TrackOption } from '.'

export type TrackHomeClickParams = TrackOption & {
    f_page: 'webhome'
    btn_position: 'create_with_ima'
    btn_name: 'upload_file_click' | 'auto_mode_click' | 'manual_modec_click' | 'tag_click' | 'content_click' | 'content_expo' | 'model_pk_click' | 'model_pk_send_click'
    tag_id?: string
    banner_id?: string
    conversation_id?: string
    cid?: string
}

export function trackHomeClick(params: Pick<TrackHomeClickParams, 'tag_id' | 'btn_name' | 'banner_id' | 'conversation_id' | 'cid'>) {
    track('ima_function_click', {
        f_page: 'webhome',
        btn_position: 'create_with_ima',
        ...params,
    })
}
