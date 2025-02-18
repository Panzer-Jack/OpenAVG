import { StageType } from '../../../../constants'
import { stageManager } from '../../../../stage'

export function onExit() {
  stageManager.currentStage = StageType.GLOBAL
  window.location.href = 'about:blank'
}
