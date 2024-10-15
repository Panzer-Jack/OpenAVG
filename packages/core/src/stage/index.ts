import type { IApiCore, IGlobalConfig, IStages } from '@openavg/types'
import type { Application } from 'pixi.js'
import { Container, Sprite } from 'pixi.js'

import { apiManager } from '../managers/api-manager'
import { assetsManager } from '../managers/assets-manager'
import { effectsManager } from '../managers/effects-manager'
import { eventManager } from '../managers/event-manager'
import { tickerManager } from '../managers/ticker-manager'
import { StageType } from './../constants'
import { MenuLayerManager } from './menu-layer'
import { NovelLayerManager } from './novel-layer'

import '../effects'

export class StageManager {
  app: Application
  currentStage: StageType
  globalConfig: IGlobalConfig
  apiCore: IApiCore
  stages: IStages
  layerManagers: {
    novelLayer: NovelLayerManager
    menuLayer: MenuLayerManager
  }

  assetsManager = assetsManager
  effectsManager = effectsManager
  eventManager = eventManager
  apiManager = apiManager
  tickerManager = tickerManager

  private isRender = false
  private videoSprite: Sprite | null
  private videoTimeout: NodeJS.Timeout | null

  // 责任链：bef -> render -> aft
  beforeRenderCb = new Set<() => void>()
  afterRenderCb = new Set<() => void>()

  constructor() {}

  async init(app: Application, globalConfig: IGlobalConfig) {
    this.app = app
    this.currentStage = StageType.GLOBAL
    this.globalConfig = globalConfig

    // 初始化 资源管理器
    this.assetsManager = assetsManager.init()
    await this.assetsManager.loadAssets({
      type: StageType.GLOBAL,
      globalConfig: this.globalConfig,
    })

    // 初始化 Ticker管理器
    this.tickerManager = this.tickerManager.init(this.app)

    // 初始化 事件管理器
    this.eventManager = eventManager.init(this.app)

    // 初始化 特效管理器
    this.effectsManager = effectsManager.init(this.app)

    // 初始化 Stage管理器
    this.layerManagers = {
      novelLayer: new NovelLayerManager(this.app),
      menuLayer: new MenuLayerManager(this.app),
    }

    this.stages = {
      game2DLayer: new Container({ label: 'Game2DLayer' }),
      novelLayer: this.layerManagers.novelLayer.container,
      menuLayer: this.layerManagers.menuLayer.container,
    }

    // 初始化场景层次结构
    this.app.stage.addChild(this.stages.game2DLayer)
    this.app.stage.addChild(this.stages.novelLayer)
    this.app.stage.addChild(this.stages.menuLayer)

    // 初始化出场动画
    const videoTextrue
            = this.assetsManager.assetsPacks.GLOBAL.VIDEO_TEXTURE['before-main']
    if (videoTextrue) {
      this.videoSprite = new Sprite(
        this.assetsManager.assetsPacks.GLOBAL.VIDEO_TEXTURE[
          'before-main'
        ],
      )
      this.videoSprite.width = this.app.screen.width
      this.videoSprite.height = this.app.screen.height
    }

    // 默认任务链
    this.defaultCbInit()

    return this
  }

  async render() {
    if (!this.isRender) {
      await this.beforeRender()
      await this.layerManagers.menuLayer.render()
      this.eventManager.active()
      await this.afterRender()
    }
  }

  async playVideo() {
    return new Promise<void>((resolve) => {
      this.app.stage.addChild(this.videoSprite)
      this.videoSprite.eventMode = 'static'
      this.videoSprite.onclick = () => {
        this.skipVideo()
        resolve()
      }
      this.videoTimeout = setTimeout(() => {
        this.skipVideo()
        resolve()
      }, this.videoSprite.texture.source.resource.duration * 1000)
    })
  }

  skipVideo() {
    if (this.videoSprite) {
      clearTimeout(this.videoTimeout)
      this.videoTimeout = null
      this.app.stage.removeChild(this.videoSprite)
    }
  }

  private defaultCbInit() {
    this.beforeRenderCb.add(this.playVideo.bind(this))
  }

  private async beforeRender() {
    return new Promise<void>((resolve) => {
      const beforeRenderCb = this.beforeRenderCb

      if (beforeRenderCb.size) {
        const promises = Array.from(beforeRenderCb).map(fn => fn()) // 执行所有回调并收集 Promise
        Promise.all(promises).then(() => resolve()) // 等待所有回调执行完成后 resolve
      } else {
        resolve()
      }
    })
  }

  private afterRender(): Promise<void> {
    return new Promise<void>((resolve) => {
      const afterRenderCb = this.afterRenderCb

      if (afterRenderCb.size) {
        const promises = Array.from(afterRenderCb).map(fn => fn()) // 执行所有回调并收集 Promise
        Promise.all(promises).then(() => resolve()) // 等待所有回调执行完成后 resolve
      } else {
        resolve()
      }
    })
  }
}

export const stageManager = new StageManager()
