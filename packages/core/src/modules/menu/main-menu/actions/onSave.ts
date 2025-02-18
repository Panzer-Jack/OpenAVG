import { mainMenu } from '..'
import { StageType } from '../../../../constants'
import { stageManager } from '../../../../stage'

export async function onSave(fn: () => Promise<void>) {
  mainMenu.stopEffects()
  await fn()
  stageManager.lastStage = stageManager.currentStage
  stageManager.currentStage = StageType.GLOBAL
}
