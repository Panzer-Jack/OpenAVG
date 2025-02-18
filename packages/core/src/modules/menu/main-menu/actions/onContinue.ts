import type { SaveData } from '@openavg/types'
import { mainMenu } from '..'
import { StageType } from '../../../../constants'
import { tickerManager } from '../../../../managers/ticker-manager'
import { stageManager } from '../../../../stage'

export async function onContinue(saveData: SaveData) {
  if (!mainMenu.btnLock && saveData) {
    mainMenu.btnLock = true
    const sceneManager = stageManager.layerManagers.novelLayer.sceneManager
    await sceneManager.loadGame({ saveData, isMainMenu: true })
    stageManager.currentStage = StageType.NOVEL
  }
}
