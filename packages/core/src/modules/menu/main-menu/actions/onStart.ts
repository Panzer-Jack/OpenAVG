import { mainMenu } from '..'
import { ApiEnum, StageType } from '../../../../constants'
import { apiManager } from '../../../../managers/api-manager'
import { tickerManager } from '../../../../managers/ticker-manager'
import { stageManager } from '../../../../stage'

export async function onStart() {
  if (!mainMenu.btnLock) {
    mainMenu.btnLock = true
    const sceneManager = stageManager.layerManagers.novelLayer.sceneManager
    tickerManager.clearListeners()
    const [chapter, _] = await Promise.all([
      apiManager.fetch({
        name: ApiEnum.fetchChapter,
        params: { name: 'chapter1' },
      }),
      mainMenu.hide(),
    ])
    stageManager.currentStage = StageType.NOVEL
    await sceneManager.initChapter({ chapter })
  }
}
