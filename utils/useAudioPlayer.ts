import { ref, computed, watch, onUnmounted, unref } from 'vue'
import type { Ref } from 'vue'
import { useEventHandler, useCleanupQueue } from './index'
import { useToast } from '@/composables/useToast'

// 互斥播放：全局只允许一个音频播放
let lastAudio: HTMLAudioElement | null = null
/**
 * @description 音频播放 hook，支持播放/暂停、进度、时长、跳转、播放状态等
 * @param {string | Ref<string>} url - 音频文件地址（支持响应式和静态）
 * @returns {object} 播放控制与状态
 * @example
 * const player = useAudioPlayer(url)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
 */
export function useAudioPlayer(url: string | Ref<string>) {
    const audio = ref<HTMLAudioElement | null>(null)
    const playing = ref(false)
    const current = ref(0)
    const duration = ref(0)
    const loading = ref(true)
    const progress = computed(() =>
        duration.value ? current.value / duration.value : 0,
    )
    const toast = useToast()

    function pauseOthers() {
        if (lastAudio && lastAudio !== audio.value) {
            lastAudio.pause()
        }
        lastAudio = audio.value
    }

    function play() {
        if (!audio.value) {
            console.warn('[useAudioPlayer] play: audio.value is null')
            return
        }
        pauseOthers()
        seek(current.value, true)
        console.log('[useAudioPlayer] play() called, src:', audio.value.src)
        const playPromise = audio.value.play()
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(err => {
                console.error('[useAudioPlayer] play() error:', err)
            })
        }
    }
    function pause() {
        if (!audio.value) {
            console.warn('[useAudioPlayer] pause: audio.value is null')
            return
        }
        console.log('[useAudioPlayer] pause() called')
        audio.value.pause()
    }
    function seek(val: number, isTime = false) {
        // console.log('[useAudioPlayer] seek to1', val)
        const time = isTime ? val : val * duration.value
        current.value = time
        if (!audio.value || !duration.value) {
            // console.warn('[useAudioPlayer] seek: audio or duration is null')
            return
        }
        audio.value.currentTime = time
    }

    function onTimeUpdate() {
        if (!audio.value) return
        current.value = audio.value.currentTime
    }
    function onLoadedMetadata() {
        if (!audio.value) return
        duration.value = audio.value.duration
        loading.value = false
        // console.log('[useAudioPlayer] loadedmetadata, duration:', duration.value)
    }
    function onPlay() {
        playing.value = true
        console.log('[useAudioPlayer] onPlay')
    }
    function onPlaying() {
        playing.value = true
        loading.value = false
    }
    function onPause() {
        playing.value = false
        console.log('[useAudioPlayer] onPause')
    }
    function onEnded() {
        playing.value = false
        current.value = 0
        console.log('[useAudioPlayer] onEnded')
    }
    function onCanPlay() {
        loading.value = false
    }
    function onError(e: Event) {
        console.error('[useAudioPlayer] audio error', e)

        toast.show('音频播放失败', {
            description: '无法播放该音频文件，请检查文件格式或网络连接。',
        })
    }
    function onSeeking() {
        // seeking 时不设置 loading，等待 waiting 事件再显示
        console.log('[useAudioPlayer] onSeeking')
    }
    function onWaiting() {
        loading.value = true
        console.log('[useAudioPlayer] onWaiting (buffering)')
    }

    // 事件清理队列
    const { addCleanup, cleanup } = useCleanupQueue()

    function bindAudioEvents(target: HTMLAudioElement) {
        addCleanup(
            useEventHandler(target, 'timeupdate', onTimeUpdate),
            useEventHandler(target, 'loadedmetadata', onLoadedMetadata),
            useEventHandler(target, 'play', onPlay),
            useEventHandler(target, 'playing', onPlaying),
            useEventHandler(target, 'pause', onPause),
            useEventHandler(target, 'ended', onEnded),
            useEventHandler(target, 'canplay', onCanPlay),
            useEventHandler(target, 'seeking', onSeeking),
            useEventHandler(target, 'waiting', onWaiting),
            useEventHandler(target, 'error', onError),
        )
        // console.log('[useAudioPlayer] events bound to audio', target)
    }
    watch(
        () => unref(url),
        val => {
            cleanup() // 先清理旧事件
            if (audio.value) {
                audio.value.pause()
                audio.value.src = ''
            }
            // 始终用 new Audio(url) 创建新实例，参考 MDN
            audio.value = new Audio(val)
            audio.value.preload = 'auto'
            bindAudioEvents(audio.value)
            loading.value = true
            seek(current.value, true)
            // console.log('[useAudioPlayer] new Audio created:', val)
        },
        { immediate: true },
    )

    onUnmounted(() => {
        if (audio.value) {
            audio.value.pause()
            audio.value.src = ''
        }
        cleanup()
        // console.log('[useAudioPlayer] unmounted, audio cleaned up')
    })

    return {
        state: toRefs(
            readonly({
                playing,
                current,
                duration,
                progress,
                loading,
            }),
        ),
        play,
        pause,
        seek,
        audio, // 暴露 audio 实例便于调试
    }
}
