import type { Application } from 'pixi.js'
import type { AssetsPacks } from '../../../managers/assets-manager/assetsConfig'
import { Container } from 'pixi.js'
import { assetsManager } from '../../../managers/assets-manager'

class ConfigMenu {
  app: Application
  fatherContainer: Container
  container = new Container({ label: 'ConfigMenu' })

  assetsManager: typeof assetsManager
  assetsPack: AssetsPacks

  constructor() {}
  init({
    app,
        fatherContainer,
        assetsPack,
  }: {
    app: Application
    fatherContainer: Container
    assetsPack: AssetsPacks
  }) {
    this.app = app
    this.fatherContainer = fatherContainer
    this.assetsManager = assetsManager
    this.assetsPack = assetsPack
    this.fatherContainer.addChild(this.container)

    return this
  }
}

export const configMenu = new ConfigMenu()
