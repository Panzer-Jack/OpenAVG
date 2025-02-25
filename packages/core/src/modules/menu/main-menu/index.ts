import type { SaveDataList } from '@openavg/types'
import type { Sound } from '@pixi/sound'
import type { Application } from 'pixi.js'

import type { AssetsPacks } from '../../../managers/assets-manager/assetsConfig'
import { ButtonContainer } from '@pixi/ui'

import localforage from 'localforage'
import { AlphaFilter, Container, Sprite } from 'pixi.js'
import { openAVGCore } from '../../../../'
import { CommonButton } from '../../../components/button'
import { fadeIn, fadeOut } from '../../../filters/fade'
import { scaleToNormal } from '../../../filters/zoom'
import { assetsManager } from '../../../managers/assets-manager'
import { soundManager } from '../../../managers/sound-manager'
import { effectsManager } from '../../../managers/effects-manager'
import { tickerManager } from '../../../managers/ticker-manager'
import { stageManager } from '../../../stage'
import { centerView, row } from '../../../utils/layout'
import { resizeToCanvas } from '../../../utils/resize'
import { actions } from './actions'
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
  btnRefresh: () => void

  constructor() { }

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
    if (tickerManager.hasListener('showMainMenu')) {
      tickerManager.removeListener('showMainMenu')
    }
    tickerManager.addListener('showMainMenu', () => {
      fadeInTween.update()
      zoomOutTween.update()
    })
  }

  async render() {
    if (!this.isRender) {
      const saveDataList: SaveDataList = await localforage.getItem(`${openAVGCore.gameTitle}-saveGame`)

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
      soundManager.playBgm(mainMenuMusic)

      // 触发动画
      effectsManager.start('sakura')
      this.initFilter(mainMenuBgSprite)

      this.mainMenuBgSprite = mainMenuBgSprite
      this.mainMenuMusic = mainMenuMusic
      this.buttonRender(this.defaultButtons(saveDataList))
      this.isRender = true
    }
  }

  defaultButtons(saveDataList: SaveDataList) {
    const continueBtn = new CommonButton({
      text: 'Continue',
      disabled: !(saveDataList && saveDataList[0]),
      size: 'big',
      onClick: () => actions.onContinue(saveDataList[0]),
    })
    const startBtn = new CommonButton({
      text: 'Start',
      size: 'big',
      onClick: () => actions.onStart(),
    })
    const loadBtn = new CommonButton({
      text: 'Load',
      size: 'big',
      onClick: () => actions.onLoad(true),
    })

    const afStoryBtn = new CommonButton({
      text: 'AfterStory',
      size: 'big',
      disabled: true,
      onClick: () => actions.onAFStory(),
    })
    const galleryBtn = new CommonButton({
      text: 'Gallery',
      size: 'big',
      disabled: true,
      onClick: () => actions.onGallery(),
    })
    const configBtn = new CommonButton({
      text: 'Config',
      size: 'big',
      // disabled: true,
      onClick: () => actions.onConfig(),
    })
    const ExitBtn = new CommonButton({
      text: 'Exit',
      size: 'big',
      onClick: () => actions.onExit(),
    })
    return {
      row1: [continueBtn, startBtn, loadBtn],
      row2: [afStoryBtn, galleryBtn, configBtn, ExitBtn],
    }
  }

  async stopEffects() {
    effectsManager.stopAll()
    this.container.eventMode = 'none'
  }

  async show() {
    const menuLayerManager = stageManager.layerManagers.menuLayer
    menuLayerManager.whiteBgShow()
    // 触发动画
    effectsManager.start('sakura')
    resizeToCanvas({
      image: this.mainMenuBgSprite,
      app: this.app,
    })
    await this.initFilter(this.mainMenuBgSprite)
    if (!this.mainMenuMusic.isPlaying) {
      this.mainMenuMusic.play()
    }
    this.btnRefresh && this.btnRefresh()
    this.container.eventMode = 'static'
  }

  async hide() {
    const menuLayerManager = stageManager.layerManagers.menuLayer
    menuLayerManager.whiteBgHidden()
    const mainMenuFadeOut = await fadeOut({
      filter: this.container.filters[0],
    })
    mainMenuFadeOut.start()
    tickerManager.addListener('hideMainMenu', () => mainMenuFadeOut.update())
    effectsManager.stopAll()
    const mainMenuMusic = this.assetsPack.GAME_AUDIO['main-menu']
    mainMenuMusic.stop()
    this.container.eventMode = 'none'
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

    const btnSpriteRow1 = row1.map((btn, idx) => {
      tickerManager.addListener(`btnRow1InMainMenu-${idx}`, () => btn.tween.update())
      return btn.view as Sprite
    })
    const btnSpriteRow2 = row2.map((btn, idx) => {
      tickerManager.addListener(`btnRow2InMainMenu-${idx}`, () => btn.tween.update())
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

    this.btnRefresh = async () => {
      const saveDataList: SaveDataList = await localforage.getItem(`${openAVGCore.gameTitle}-saveGame`)

      row1[0].disable = !(saveDataList && saveDataList[0])
      row1[0].onClick = () => actions.onContinue(saveDataList[0])
      console.log(row1[0].enabled, row1[0].enabled)

      row1.forEach((btn, idx) => {
        if (tickerManager.hasListener(`btnRow1InMainMenu-${idx}`)) {
          tickerManager.removeListener(`btnRow1InMainMenu-${idx}`)
        }
        tickerManager.addListener(`btnRow1InMainMenu-${idx}`, () => btn.tween.update())
      })
      row2.forEach((btn, idx) => {
        if (tickerManager.hasListener(`btnRow2InMainMenu-${idx}`)) {
          tickerManager.removeListener(`btnRow2InMainMenu-${idx}`)
        }
        tickerManager.addListener(`btnRow2InMainMenu-${idx}`, () => btn.tween.update())
      })
    }
  }
}

export const mainMenu = new MainMenu()
