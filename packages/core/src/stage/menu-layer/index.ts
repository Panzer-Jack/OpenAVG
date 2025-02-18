import type { Application } from 'pixi.js'
import type { AssetsPacks } from '../../managers/assets-manager/assetsConfig'

import { Container, Graphics } from 'pixi.js'

import { assetsManager } from '../../managers/assets-manager'
import { mainMenu } from '../../modules/menu/main-menu'

// import { configMenu } from '../../modules/menu/config-menu'
// import { galleryMenu } from '../../modules/menu/gallery-menu'
// import { loadMenu } from '../../modules/menu/archive-menu'
// import { saveMenu } from '../../modules/menu/save-menu'

export class MenuLayerManager {
  app: Application
  container = new Container({ label: 'MenuLayer' })

  menus: {
    mainMenu: typeof mainMenu
    // loadMenu: typeof loadMenu
    // saveMenu: typeof saveMenu
    // configMenu: typeof configMenu
    // galleyMenu: typeof galleryMenu
  }

  assetsManager: typeof assetsManager
  assetsPack: AssetsPacks

  private isRender = false

  private whiteBg: Graphics

  constructor(app: Application) {
    this.app = app
    this.assetsManager = assetsManager
    this.assetsPack = this.assetsManager.assetsPacks.GLOBAL

    // 白色垫底
    this.whiteBg = new Graphics()
      .roundRect(0, 0, this.app.screen.width, this.app.screen.height)
      .fill({
        color: 'white',
      })
    this.container.addChild(this.whiteBg)

    this.menus = {
      mainMenu: mainMenu.init({
        app: this.app,
        fatherContainer: this.container,
        assetsPack: this.assetsPack,
      }),
      // loadMenu: loadMenu.init({
      //   app: this.app,
      //   fatherContainer: this.container,
      //   assetsPack: this.assetsPack,
      // }),
      // saveMenu: saveMenu.init({
      //   app: this.app,
      //   fatherContainer: this.container,
      //   assetsPack: this.assetsPack,
      // }),
      // configMenu: configMenu.init({
      //   app: this.app,
      //   fatherContainer: this.container,
      //   assetsPack: this.assetsPack,
      // }),
      // galleyMenu: galleryMenu.init({
      //   app: this.app,
      //   fatherContainer: this.container,
      //   assetsPack: this.assetsPack,
      // }),
    }
    for (const key in this.menus) {
      this.container.addChild(this.menus[key].container)
    }
  }

  whiteBgHidden() {
    this.whiteBg.visible = false
  }

  whiteBgShow() {
    this.whiteBg.visible = true
  }

  async render() {
    if (!this.isRender) {
      await this.menus.mainMenu.render()
      this.isRender = true
    }
  }
}
