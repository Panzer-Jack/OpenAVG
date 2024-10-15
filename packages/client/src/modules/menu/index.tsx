import type { MenuLayerManager } from '@openavg/core/src/stage/menu-layer'
import { useManagers } from '@/store'
import { stageManager } from '@openavg/core'
import { useCallback, useEffect } from 'react'

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
  const menuController = new MenuController(menuManager)

  const init = useCallback(async () => {
    menuController.initMainMenu()
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return <></>
}
