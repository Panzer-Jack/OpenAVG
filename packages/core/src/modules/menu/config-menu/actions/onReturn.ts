import { StageType } from '../../../../constants'

import { stageManager } from '../../../../stage'
import { actions } from '../../main-menu/actions'

export async function onReturn() {
  stageManager.currentStage = stageManager.lastStage
  stageManager.lastStage = null
  if (stageManager.currentStage === StageType.GLOBAL) {
    await actions.onTitle({ reset: false })
  }
}
