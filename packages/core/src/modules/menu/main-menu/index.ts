import type { Sound } from '@pixi/sound'
import type { Application } from 'pixi.js'
import type { AssetsPacks } from '../../../managers/assets-manager/assetsConfig'

import { ButtonContainer } from '@pixi/ui'
import { AlphaFilter, Container, Sprite } from 'pixi.js'

import { CommonButton } from '../../../components/button'
import { fadeIn, fadeOut } from '../../../filters/fade'
import { scaleToNormal } from '../../../filters/zoom'
import { assetsManager } from '../../../managers/assets-manager'
import { effectsManager } from '../../../managers/effects-manager'
import { tickerManager } from '../../../managers/ticker-manager'
import { stageManager } from '../../../stage'
import { centerView, row } from '../../../utils/layout'

import { resizeToCanvas } from '../../../utils/resize'
import {
  onAFStory,
  onConfig,
  onContinue,
  onExit,
  onGallery,
  onLoad,
  onStart,
} from './actions'
import './events'

class MainMenu {
  app: Application
  fatherContainer: Container
  container = new Container({ label: 'MainMenu' })

  assetsManager = assetsManager
  assetsPack: AssetsPacks

  mainMenuBgSprite: Sprite
  mainMenuMusic: Sound

  private isRender = false
  btnLock = false

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
    this.assetsPack = assetsPack
    this.fatherContainer.addChild(this.container)
    this.btnLock = false

    return this
  }

  async initFilter(mainMenuBgSprite: Sprite) {
    // 动画
    const fadeInTween = await fadeIn({
      filter: this.container.filters[0] as AlphaFilter,
    })
    const zoomOutTween = await scaleToNormal({
      sprite: mainMenuBgSprite,
      duration: 2000,
    })
    fadeInTween.start()
    zoomOutTween.start()
    tickerManager.addListener('showMainMenu', () => {
      fadeInTween.update()
      zoomOutTween.update()
    })
  }

  async render() {
    if (!this.isRender) {
      console.error('render!')
      const mainMenuBgTexture
                = this.assetsPack.SPRITE_TEXTURE['main-menu']
      const titleTextrue = this.assetsPack.SPRITE_TEXTURE.title
      const mainMenuMusic = this.assetsPack.GAME_AUDIO['main-menu']
      const mainMenuBgSprite = new Sprite(mainMenuBgTexture)
      const title = new Sprite(titleTextrue)
      resizeToCanvas({
        image: mainMenuBgSprite,
        app: this.app,
      })
      title.position.x = (mainMenuBgSprite.width - title.width) / 2

      // 渐入效果
      const alfphaFilter = new AlphaFilter()
      alfphaFilter.alpha = 0
      this.container.filters = [alfphaFilter]

      this.container.addChild(mainMenuBgSprite)
      this.container.addChild(title)
      mainMenuMusic.loop = true
      mainMenuMusic.play()

      // 触发动画
      effectsManager.start('sakura')
      this.initFilter(mainMenuBgSprite)

      this.mainMenuBgSprite = mainMenuBgSprite
      this.mainMenuMusic = mainMenuMusic
      this.buttonRender(this.defaultButtons())
      this.isRender = true
    }
  }

  defaultButtons() {
    const continueBtn = new CommonButton({
      text: 'Continue',
      disabled: true,
      onClick: () => onContinue(),
    })
    const startBtn = new CommonButton({
      text: 'Start',
      onClick: () => onStart(),
    })
    const loadBtn = new CommonButton({
      text: 'Load',
      disabled: true,
      onClick: () => onLoad(),
    })

    const afStoryBtn = new CommonButton({
      text: 'AfterStory',
      disabled: true,
      onClick: () => onAFStory(),
    })
    const galleryBtn = new CommonButton({
      text: 'Gallery',
      disabled: true,
      onClick: () => onGallery(),
    })
    const configBtn = new CommonButton({
      text: 'Config',
      disabled: true,
      onClick: () => onConfig(),
    })
    const ExitBtn = new CommonButton({
      text: 'Exit',
      onClick: () => onExit(),
    })
    return {
      row1: [continueBtn, startBtn, loadBtn],
      row2: [afStoryBtn, galleryBtn, configBtn, ExitBtn],
    }
  }

  async hide() {
    const menuLayerManager = stageManager.layerManagers.menuLayer
    menuLayerManager.whiteBgHidden()
    const mainMenuFadeOut = await fadeOut({
      filter: this.container.filters[0],
    })
    mainMenuFadeOut
      .onComplete(() => menuLayerManager.container.eventMode = 'none')
      .start()
    tickerManager.addListener('hideMainMenu', () => mainMenuFadeOut.update())
    effectsManager.stopAll()
    const mainMenuMusic = this.assetsPack.GAME_AUDIO['main-menu']
    mainMenuMusic.stop()
  }

  buttonRender({
    row1,
        row2,
  }: {
    row1: CommonButton[]
    row2: CommonButton[]
  }) {
    const btnRow1Container = new ButtonContainer()
    const btnRow2Container = new ButtonContainer()

    btnRow1Container.position.y = 750
    btnRow2Container.position.y = 900

    const btnSpriteRow1 = row1.map((btn) => {
      tickerManager.addListener('btnRow1InMainMenu', () => btn.tween.update())
      return btn.view as Sprite
    })
    const btnSpriteRow2 = row2.map((btn) => {
      tickerManager.addListener('btnRow2InMainMenu', () => btn.tween.update())
      return btn.view as Sprite
    })

    row(btnSpriteRow1, 400)
    row(btnSpriteRow2, 400)

    btnSpriteRow1.forEach(btn => btnRow1Container.addChild(btn))
    btnSpriteRow2.forEach(btn => btnRow2Container.addChild(btn))

    centerView({
      pos: 'x',
      view: btnRow1Container,
      target: this.container,
    })
    centerView({
      pos: 'x',
      view: btnRow2Container,
      target: this.container,
    })
    this.container.addChild(btnRow1Container)
    this.container.addChild(btnRow2Container)
  }
}

export const mainMenu = new MainMenu()
