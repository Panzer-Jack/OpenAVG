import type { IChapter, IScene, ISceneContainers, ISceneRaw } from '@openavg/types'
import type { Application } from 'pixi.js'
import { Container } from 'pixi.js'

import { StageType } from '../../../../constants'
import { assetsManager } from '../../../../managers/assets-manager'
import { execActions } from '../../actions'
import { DialogueBox } from '../../components/dialogueBox'

import '../../events'

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
  currentScene: IScene
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

  async initChapter(chapter: IChapter) {
    this.chapter = chapter
    const scenes = chapter.scenes

    if (scenes) {
      // 渲染对话框
      this.dialogueBox.render()

      await assetsManager.loadAssets({
        type: StageType.NOVEL,
        chapter,
      })

      this.changeScene(scenes[0])
      await this.nextAction()
    }
  }

  async nextAction() {
    const currentScene = this.currentScene
    if (
      !currentScene.actionsList.length
      || currentScene.currentActionsId
      === currentScene.actionsList.length - 1
    ) {
      this.isLastAction = true
    }
    const actions = currentScene.actionsList[currentScene.currentActionsId]
    // 处理actions指令
    if (!this.isExecuting) { 
      this.isExecuting = true
      await execActions({ actions })
      currentScene.currentActionsId++
      this.isExecuting = false
    }
  }

  nextScene() {
    const scenes = this.chapter?.scenes
    if (scenes) {
      if (this.currentSceneId < scenes.length - 1) {
        this.currentSceneId++
        this.changeScene(scenes[this.currentSceneId])
        this.isLastAction = false
      } else {
        console.log('end')
      }
    }
  }

  changeScene(sceneRaw: ISceneRaw) {
    if (this.currentScene) {
      this.sceneStack.push(this.currentScene)
    }

    // 暂存上一个scene的 对话图片音频 等状态 （ 恢复存档用 ）
    const bgAssets = this.currentScene && this.currentScene.background
    const audioAssets = this.currentScene && this.currentScene.music
    const talkAssets = this.currentScene && this.currentScene.talk
    const imagesAssets = this.currentScene && this.currentScene.images

    const scene: IScene = {
      name: sceneRaw.name,
      currentActionsId: 0,
      background: bgAssets,
      music: audioAssets,
      talk: talkAssets,
      images: imagesAssets,
      actionsList: sceneRaw.actions,
    }

    this.currentScene = scene
    this.nextAction()
  }
}
