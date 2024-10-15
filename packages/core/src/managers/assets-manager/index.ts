import type { IChapter, IGlobalConfig } from '@openavg/types'
import { Assets } from 'pixi.js'

import { StageType } from '../../constants'
import { AssetsPacks } from './assetsConfig'

class AssetsManager {
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

  init() {
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
        chapter,
        globalConfig,
  }: {
    type: StageType
    chapter?: IChapter
    globalConfig?: IGlobalConfig
  }) {
    return new Promise<void>((resolve) => {
      if (this.isLoading)
        return
      this.isLoading = true
      let _assetsPacks: AssetsPacks

      switch (type) {
        case StageType.GLOBAL:
          _assetsPacks = this.assetsPacks[StageType.GLOBAL]
          _assetsPacks.loadGlobalConfig({ globalConfig })
          break
        case StageType.NOVEL:
          _assetsPacks = this.assetsPacks[StageType.NOVEL]
          _assetsPacks.loadConfig({ chapter })
          break
        case StageType.GAME_2D:
          _assetsPacks = this.assetsPacks[StageType.GAME_2D]
          break
        case StageType.GAME_3D:
          _assetsPacks = this.assetsPacks[StageType.GAME_3D]
          break
        default:
          _assetsPacks = this.assetsPacks[StageType.NOVEL]
          _assetsPacks.loadConfig({ chapter })
          break
      }
      // 加载各个分包
      _assetsPacks
        .loadAllPacks({
          async loadBundle(bundleName, bundleContents) {
            Assets.addBundle(bundleName, bundleContents)
            const loadedBundle = await Assets.loadBundle(bundleName)
            _assetsPacks[bundleName] = loadedBundle
          },
        })
        .then(() => {
          this.isLoading = false
          resolve()
        })
    })
  }
}

export const assetsManager = new AssetsManager()
