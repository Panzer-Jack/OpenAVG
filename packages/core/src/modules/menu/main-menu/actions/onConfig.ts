import { mainMenu } from '..'
import { StageType } from '../../../../constants'
import { stageManager } from '../../../../stage'

export async function onConfig(fn: () => Promise<void>) {
  mainMenu.stopEffects()
  await fn()
  stageManager.lastStage = stageManager.currentStage
  stageManager.currentStage = StageType.GLOBAL
}
