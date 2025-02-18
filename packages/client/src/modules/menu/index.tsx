import type { MenuLayerManager } from '@openavg/core/src/stage/menu-layer'
import { useGlobalSignals, useManagers } from '@/store'
import { stageManager, StageType } from '@openavg/core'
import { eventManager } from '@openavg/core/src/managers/event-manager'
import { useCallback, useEffect } from 'react'

import { ArchiveMenu } from './components/archive-menu'
import { UI } from './UI'
import { ConfigMenu } from './components/config-menu'

class MenuController {
  stageManager: typeof stageManager
  menuManager: MenuLayerManager

  constructor(menuManager: MenuLayerManager) {
    this.menuManager = menuManager
    this.stageManager = stageManager
  }

  async initMainMenu() {
    this.stageManager.render()
  }
}

export function Menu() {
  const menuManager = useManagers(store => store.menuManager)
  const setCurrentStage = useGlobalSignals(store => store.setCurrentStage)
  const currentStage = useGlobalSignals(store => store.currentStage)
  const menuController = new MenuController(menuManager)

  const init = useCallback(async () => {
    menuController.initMainMenu()
  }, [])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    // 监听舞台
    eventManager.install({
      name: 'currentStageUpdated',
      event: () => {
        setCurrentStage(stageManager.currentStage)
      },
    })
    return () => {
      eventManager.uninstall('currentStageUpdated')
    }
  }, [])

  return (
    <>
      <ArchiveMenu />
      <ConfigMenu />
      {currentStage === StageType.NOVEL ? <UI /> : ''}
    </>
  )
}
