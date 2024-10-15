import type { IApiCore, IGlobalConfig } from '@openavg/types'
import { sound } from '@pixi/sound'

import { apiManager } from './managers/api-manager'
import { PixiInstance } from './pixi'
import { stageManager } from './stage'

export class OpenAVGCore {
  pixiInstance = new PixiInstance()
  stageManager = stageManager
  apiManager = apiManager
  gameTitle: string

  // 游戏 JSON配置文件
  private _globalConfig: IGlobalConfig
  apiCore: IApiCore

  constructor() {}

  async init(globalConfig: IGlobalConfig, apiCore: IApiCore) {
    this.globalConfig = globalConfig
    this.apiCore = apiCore
    sound.disableAutoPause = true

    // 初始化 api管理器
    apiManager.init(apiCore)

    this.gameTitle = this.globalConfig.title
    await this.pixiInstance.watchInit()
    this.stageManager = await stageManager.init(
      this.pixiInstance.app,
      this.globalConfig,
    )
    return this
  }

  setFavicon(iconURL: string) {
    const link: HTMLLinkElement
            = document.querySelector('link[rel*=\'icon\']')
            || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = iconURL
    document.getElementsByTagName('head')[0].appendChild(link)
  }

  set globalConfig(globalConfig: IGlobalConfig) {
    this._globalConfig = globalConfig
    document.title = globalConfig.title
    if (globalConfig.favicon) {
      this.setFavicon(globalConfig.favicon)
    }
  }

  get globalConfig() {
    return this._globalConfig
  }
}
export const openAVGCore = new OpenAVGCore()

export * from './constants'
export * from './pixi'
export * from './stage'
