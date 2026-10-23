export interface ISeoMeta {
    title: string
    description?: string
    keywords?: string
    image?: string
    imageWidth?: number
    imageHeight?: number
    url?: string
    // https://ogp.me/#metadata
    /**
     * Open Graph 类型，详见 https://ogp.me/#types
     * website/article/book/profile/music.song/music.album/music.playlist/music.radio_station/video.movie/video.episode/video.tv_show/video.other
     */
    type?:
      | 'website'
      | 'article'
      | 'book'
      | 'profile'
      | 'music.song'
      | 'music.album'
      | 'music.playlist'
      | 'music.radio_status'
      | 'video.movie'
      | 'video.episode'
      | 'video.tv_show'
      | 'video.other'
    locale?: string
    siteName?: string
    canonical?: string
    [key: string]: any
}

export const baseSeoMeta: ISeoMeta = {
    title: 'Ima Studio – AI Media Agent for Video, Image & Audio',
    description:
        'Ima Studio’s AI Media Agent is a multi-modal AI creation platform that empowers users to generate images, videos & audios with simple text prompts. ',
    keywords: 'ImaStudio, ai, tool, content, image, video, audio',
    image: 'https://www.imastudio.com/assets/og-cover.webp',
    imageWidth: 1200,
    imageHeight: 630,
    url: 'https://www.imastudio.com/',
    type: 'website',
    locale: 'en',
    siteName: 'ImaStudio',
    canonical: 'https://www.imastudio.com/',
}
