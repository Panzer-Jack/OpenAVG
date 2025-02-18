import { StageType } from '../../../../constants'
import { stageManager } from '../../../../stage'

export function onAFStory() {
  stageManager.currentStage = StageType.GLOBAL
}
