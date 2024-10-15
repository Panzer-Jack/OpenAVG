import { debounce } from 'lodash'
import { StageType } from '../../../constants'
import { eventManager } from '../../../managers/event-manager'
import { stageManager } from '../../../stage'
import { SceneClickEvents } from '../constants'
import Hooks from '../Hooks'

function sceneClick(event: SceneClickEvents) {
  const hooks = Hooks.getInstance()
  const sceneManager = hooks.sceneManager
  console.log(event)
  // 场景切换
  switch (event) {
    case SceneClickEvents.skipType:
      sceneManager.dialogueBox.skipType()
      break
    case SceneClickEvents.nextScene:
      sceneManager.nextScene()
      break
    case SceneClickEvents.nextAction:
      sceneManager.nextAction()
      break
  }
}

function sceneClickEvent() {
  const hooks = Hooks.getInstance()
  const sceneManager = hooks.sceneManager

  const cb = debounce(() => {
    if (stageManager.currentStage === StageType.NOVEL) {
      if (sceneManager.dialogueBox.isTyping) {
        sceneClick(SceneClickEvents.skipType)
      } else if (sceneManager.isLastAction) {
        sceneClick(SceneClickEvents.nextScene)
      } else {
        sceneClick(SceneClickEvents.nextAction)
      }
    }
  }, 100)

  // 场景切换 防抖处理
  sceneManager.container.on('pointerdown', cb)
}

eventManager.install({
  name: 'sceneClick',
  event: sceneClickEvent,
})
