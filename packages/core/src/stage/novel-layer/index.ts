import  { Application, Graphics } from 'pixi.js'
import type { AssetsPacks } from '../../managers/assets-manager/assetsConfig'

import { Container } from 'pixi.js'
import { assetsManager } from '../../managers/assets-manager'
import Hooks from '../../modules/novel/Hooks'
import { SceneManager } from '../../modules/novel/managers/scene-manager'

export class NovelLayerManager {
  app: Application
  container = new Container({ label: 'NovelLayer' })
  hooks: Hooks
  sceneManager: SceneManager
  assetsManager: typeof assetsManager

  assetsPack: AssetsPacks

  private blackBg: Graphics

  constructor(app: Application) {
    this.app = app
    this.sceneManager = new SceneManager(this.app)
    this.assetsManager = assetsManager
    this.assetsPack = this.assetsManager.assetsPacks.NOVEL

    // 初始化 hooks 全局钩子
    this.hooks = Hooks.getInstance()
    this.hooks.app = this.app
    this.hooks.sceneManager = this.sceneManager
    this.hooks.assetsPack = this.assetsPack

    this.blackBg = new Graphics()
      .roundRect(0, 0, this.app.screen.width, this.app.screen.height)
      .fill({
        color: 'black',
      })
    this.blackBg.eventMode = 'none'
    
    this.container.addChild(this.blackBg)
    this.container.addChild(this.sceneManager.container)
  }

  reset() {
    this.sceneManager.reset()
  }
}
