import { StageType } from '../../../../constants'
import { stageManager } from '../../../../stage'

export function onGallery() {
  stageManager.currentStage = StageType.GLOBAL
}
