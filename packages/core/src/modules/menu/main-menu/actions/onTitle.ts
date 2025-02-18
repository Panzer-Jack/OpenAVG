import { mainMenu } from '..'
import { StageType } from '../../../../constants'
import { stageManager } from '../../../../stage'

interface IOnTitleInner {
  reset?: boolean
}

type IOnTitle = IOnTitleInner

export async function onTitle({
  reset = true,
}: IOnTitle = {}) {
  reset && stageManager.layerManagers.novelLayer.reset()
  await mainMenu.show()
  stageManager.currentStage = StageType.GLOBAL
  mainMenu.btnLock = false
}
