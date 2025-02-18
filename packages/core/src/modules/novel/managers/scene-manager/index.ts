import type { IActions, IChapter, IScene, ISceneContainers, ISceneRaw, SaveData, SaveDataList } from '@openavg/types'
import type { Application } from 'pixi.js'
import { sound } from '@pixi/sound'

import dayjs from 'dayjs'
import localforage from 'localforage'
import { Container, RenderTexture } from 'pixi.js'

import { ApiEnum, openAVGCore, stageManager, StageType } from '../../../../../src'
import { apiManager } from '../../../../managers/api-manager'
import { execActions } from '../../actions'
import { DialogueBox } from '../../components/dialogueBox'
import '../../events'
import { tickerManager } from '../../../../managers/ticker-manager'

export class SceneManager {
  app: Application
  container = new Container({ label: 'Scene' })
  sceneContainers: ISceneContainers = {
    background: new Container({ label: 'Background' }),
    images: new Container({ label: 'Images' }),
    dialogueBox: new Container({ label: 'DialogueBox' }),
    ui: new Container({ label: 'UI' }),
  }

  chapter: IChapter
  isLastAction = false
  isExecuting = false
  currentScene: IScene = {
    sceneName: null,
    currentActionsId: 0,
    currentSceneId: 0,
    actionsList: [],
  }

  currentSceneId: number
  sceneStack: IScene[] = []
  dialogueBox: DialogueBox

  constructor(app: Application) {
    this.app = app
    this.currentSceneId = 0
    this.container.eventMode = 'static'

    for (const key in this.sceneContainers) {
      this.container.addChild(this.sceneContainers[key])
    }
    this.dialogueBox = new DialogueBox({
      app: this.app,
    })
    this.sceneContainers.dialogueBox.addChild(this.dialogueBox.container)
  }

  reset() {
    sound.stopAll()
    this.container.eventMode = 'static'
    this.currentScene = {
      sceneName: null,
      currentActionsId: 0,
      currentSceneId: 0,
      actionsList: [],
    }
    this.currentSceneId = 0
    this.sceneStack = []
    this.isLastAction = false
    this.isExecuting = false
    this.chapter = null

    for (const key in this.sceneContainers) {
      (this.sceneContainers[key] as Container).removeChildren()
    }
    this.dialogueBox = new DialogueBox({
      app: this.app,
    })

    this.sceneContainers.dialogueBox.addChild(this.dialogueBox.container)
  }

  async initChapter({
    chapter,
    isLoad = false,
    actionsImp
  }: {
    chapter: IChapter
    isLoad?: boolean
    actionsImp?: IActions
  }) {
    this.chapter = chapter
    const scenes = chapter.scenes

    if (scenes) {
      // 渲染对话框
      this.dialogueBox.render()
      if (!isLoad) {
        await this.changeScene(scenes[0])
      } else {
        await this.nextActions({ actionsImp })
      }
    }
  }

  async nextActions({
    actionsImp,
  }: {
    actionsImp?: IActions
  } = {}) {
    try {
      const currentScene = this.currentScene
      let actions: IActions
      if (!actionsImp) {
        actions = currentScene.actionsList[currentScene.currentActionsId]
      } else {
        actions = actionsImp
      }

      if (
        !currentScene.actionsList.length
        || currentScene.currentActionsId
        === currentScene.actionsList.length - 1
      ) {
        this.isLastAction = true
      }
      // 处理actions指令
      if (!this.isExecuting) {
        this.isExecuting = true
        await execActions({ actions })
        currentScene.currentActionsId++
        this.isExecuting = false
      }
    } catch (err) {
      console.error(err)
    }
  }

  nextScene() {
    const scenes = this.chapter?.scenes
    if (scenes) {
      if (this.currentSceneId < scenes.length - 1) {
        this.currentSceneId++
        this.isLastAction = false
        this.changeScene(scenes[this.currentSceneId])
      } else {
        console.log('end')
      }
    }
  }

  async changeScene(sceneRaw: ISceneRaw) {
    if (this.currentScene) {
      this.sceneStack.push(this.currentScene)
    }

    // 暂存上一个scene的 对话图片音频 等状态 （ 恢复存档用 ）
    const background = this.currentScene && this.currentScene.background
    const music = this.currentScene && this.currentScene.music
    const images = this.currentScene && this.currentScene.images
    const talk = this.currentScene && this.currentScene.talk

    const backgroundAction = this.currentScene && this.currentScene.backgroundAction
    const musicAction = this.currentScene && this.currentScene.musicAction
    const imagesAction = this.currentScene && this.currentScene.imagesAction

    const scene: IScene = {
      sceneName: sceneRaw.name,
      currentActionsId: 0,
      currentSceneId: this.currentSceneId,
      actionsList: sceneRaw.actions,
      background,
      music,
      images,
      talk,
      backgroundAction,
      musicAction,
      imagesAction,
    }

    this.currentScene = scene
    await this.nextActions()
  }

  async saveGame(id: number) {
    const renderTexture = RenderTexture.create({
      width: this.app.canvas.width,
      height: this.app.canvas.height,
    })
    this.dialogueBox.hide()
    this.app.renderer.render(this.app.stage, { renderTexture })
    const imgRaw = await this.app.renderer.extract.image(renderTexture)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 288
    canvas.height = 162
    ctx.drawImage(imgRaw, 0, 0, canvas.width, canvas.height)
    const img = canvas.toDataURL('image/webp', 0.5)

    const title = this.chapter && this.chapter.title
    const sceneName = this.currentScene && this.currentScene.sceneName
    const filename = this.chapter && this.chapter.filename
    const time = dayjs().valueOf()
    const currentActionsId = this.currentScene && this.currentScene.currentActionsId - 1
    const currentSceneId = this.currentSceneId

    const backgroundAction = this.currentScene && this.currentScene.backgroundAction
    const musicAction = this.currentScene && this.currentScene.musicAction
    const imagesAction = this.currentScene && this.currentScene.imagesAction
    const currentSprites = {
      backgroundAction,
      musicAction,
      imagesAction,
    }

    const data: SaveData = {
      title,
      filename,
      sceneName,
      img,
      time,
      currentActionsId,
      currentSceneId,
      currentSprites,
    }
    this.dialogueBox.show()

    const saveDataList: SaveDataList = await localforage.getItem(`${openAVGCore.gameTitle}-saveGame`) || {}

    // 0 为最新存档
    if (!saveDataList[0] || saveDataList[0].time <= data.time) {
      saveDataList[0] = data
    }

    const saveData = {
      ...saveDataList,
      [id]: data,
    }

    localforage.setItem(`${openAVGCore.gameTitle}-saveGame`, saveData)
  }

  async loadGame({
    saveData,
    i,
    isMainMenu = false
  }: {
    saveData?: SaveData
    i?: number
    isMainMenu?: boolean
  }) {

    if(isMainMenu) {
      tickerManager.clearListeners()
      const mainMenu = stageManager.layerManagers.menuLayer.menus.mainMenu
      stageManager.currentStage = StageType.NOVEL
      await mainMenu.hide()
  }

    let data: SaveData
    if (saveData) {
      data = saveData
    } else {
      const saveDataList = await localforage.getItem(`${openAVGCore.gameTitle}-saveGame`)
      data = saveDataList[i]
    }

    this.reset()

    const filename = data.filename
    this.chapter = await apiManager.fetch({
      name: ApiEnum.fetchChapter,
      params: { name: filename },
    })

    this.currentSceneId = data.currentSceneId
    this.currentScene.sceneName = data.sceneName
    this.currentScene.currentActionsId = data.currentActionsId
    this.currentScene.currentSceneId = data.currentSceneId
    this.currentScene.actionsList = this.chapter.scenes[this.currentSceneId].actions

    const actionsImp: IActions = {
      background: data.currentSprites.backgroundAction,
      music: data.currentSprites.musicAction,
      images: data.currentSprites.imagesAction,
      ...this.chapter.scenes[this.currentSceneId].actions[this.currentScene.currentActionsId],
    }

    await this.initChapter({ chapter: this.chapter, isLoad: true, actionsImp })
  }
}
