import type { IAssets, IGlobalConfig } from '@openavg/types'

import type { Application } from 'pixi.js'
import { Assets } from 'pixi.js'
import { GlobalProgressBar } from '../../components/progressBar'
import { StageType } from '../../constants'
import { AssetsPacks } from './assetsConfig'

class AssetsManager {
  app: Application
  isInitialized = false
  isLoading = false
  isUnloading = false
  assetsPacks: {
    [StageType.GLOBAL]: AssetsPacks
    [StageType.NOVEL]: AssetsPacks
    [StageType.GAME_2D]: AssetsPacks
    [StageType.GAME_3D]: AssetsPacks
  }

  constructor() {
    this.assetsPacks = {
      [StageType.GLOBAL]: new AssetsPacks({
        type: StageType.GLOBAL,
      }),
      [StageType.NOVEL]: new AssetsPacks({
        type: StageType.NOVEL,
      }),
      [StageType.GAME_2D]: new AssetsPacks({
        type: StageType.GAME_2D,
      }),
      [StageType.GAME_3D]: new AssetsPacks({
        type: StageType.GAME_3D,
      }),
    }
  }

  init(app: Application) {
    this.app = app
    return this
  }

  async unloadAssets({ type }: { type: StageType }) {
    return new Promise<void>((resolve) => {
      if (this.isUnloading)
        return
      this.isUnloading = true
      let _assetsPacks: AssetsPacks

      switch (type) {
        case StageType.GLOBAL:
          _assetsPacks = this.assetsPacks[StageType.GLOBAL]
          break
        case StageType.NOVEL:
          _assetsPacks = this.assetsPacks[StageType.NOVEL]
          break
        case StageType.GAME_2D:
          _assetsPacks = this.assetsPacks[StageType.GAME_2D]
          break
        case StageType.GAME_3D:
          _assetsPacks = this.assetsPacks[StageType.GAME_3D]
          break
        default:
          _assetsPacks = this.assetsPacks[StageType.NOVEL]
          break
      }
      // 卸载各个分包
      _assetsPacks.unloadAllPacks({
        async unloadBundle(bundleName) {
          await Assets.unloadBundle(bundleName)
          delete _assetsPacks[bundleName]
        },
      }).then(() => {
        this.isUnloading = false
        resolve()
      })
    })
  }

  async loadAssets({
    type,
    assets,
    globalConfig,
  }: {
    type: StageType
    assets?: IAssets
    globalConfig?: IGlobalConfig
  }) {
    return new Promise<void>((resolve) => {
      if (this.isLoading)
        return
      this.isLoading = true
      let _assetsPacks: AssetsPacks
      let progressBarText: string = '加载中...'

      switch (type) {
        case StageType.GLOBAL:
          _assetsPacks = this.assetsPacks[StageType.GLOBAL]
          _assetsPacks.loadGlobalConfig({ globalConfig })
          progressBarText = '加载全局配置文件...'
          break
        case StageType.NOVEL:
          _assetsPacks = this.assetsPacks[StageType.NOVEL]
          _assetsPacks.loadConfig({ assets })
          progressBarText = '加载视觉小说资源...'
          break
        case StageType.GAME_2D:
          _assetsPacks = this.assetsPacks[StageType.GAME_2D]
          progressBarText = '加载游戏资源...'
          break
        case StageType.GAME_3D:
          _assetsPacks = this.assetsPacks[StageType.GAME_3D]
          progressBarText = '加载游戏资源...'
          break
        default:
          _assetsPacks = this.assetsPacks[StageType.NOVEL]
          _assetsPacks.loadConfig({ assets })
          progressBarText = '加载视觉小说资源...'
          break
      }

      const progressBar = new GlobalProgressBar(
        this.app.stage,
        {
          fillColor: '#00b1dd',
          borderColor: '#FFFFFF',
          backgroundColor: '#fe6048',
          value: 0,
          width: 1000,
          height: 50,
          radius: 25,
          border: 3,
          animate: true,
          vertical: false,
          text: '加载中...',
        },
      )
      _assetsPacks
        .loadAllPacks({
          async loadBundle(bundleName, bundleContents) {
            Assets.addBundle(bundleName, bundleContents)
            const loadedBundle = await Assets.loadBundle(bundleName, (progress) => {
              console.log('progress', progress)
              progressBar.update(progress * 100, progressBarText)
            })
            _assetsPacks[bundleName] = loadedBundle
          },
        })
        .then(() => {
          this.isLoading = false
          progressBar.remove()
          resolve()
        })
    })
  }
}

export const assetsManager = new AssetsManager()
