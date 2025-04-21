// 配置接口
import {ref} from "vue";

export interface kiteComicConfig {
    version: string
    displayMode: 'original' | 'single' | 'double'
    isDarkMode: boolean
    zoomLevel: number
    readingDirection: 'ltr' | 'rtl'
    JapaneseReadingOrder: boolean
}

// 2. 创建响应式配置对象
const initialConfig: kiteComicConfig = {
    version: '1.0',
    displayMode: 'double',
    isDarkMode: false,
    zoomLevel: 100,
    readingDirection: 'ltr',
    JapaneseReadingOrder: false
}

const appConfig = ref<kiteComicConfig>(initialConfig)

export const getConfig = () => appConfig.value


export const setConfig = (newConfig: Partial<kiteComicConfig>) => {
    // 合并配置并验证
    const merged = {
        ...appConfig.value,
        ...newConfig
    }

    // 添加验证逻辑（示例）
    if (merged.zoomLevel < 50 || merged.zoomLevel > 200) {
        throw new Error('Invalid zoom level')
    }

    appConfig.value = merged
}

// 4. 重置为默认配置
export const resetConfig = () => {
    appConfig.value = initialConfig
}