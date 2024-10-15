import type { NovelLayerManager } from '@openavg/core/src/stage/novel-layer'
import { useManagers } from '@/store'

import { fetchChapter } from '@/utils/api'

import { useCallback, useEffect } from 'react'

class NovelController {
  novelManager: NovelLayerManager

  constructor(novelManager: NovelLayerManager) {
    this.novelManager = novelManager
  }

  async initScene({ name }: { name: string }) {
    const sceneManager = this.novelManager.sceneManager
    const chapter = await fetchChapter({ name })
    await sceneManager.initChapter(chapter)
  }
}

export function Novel() {
  const novelManager = useManagers(store => store.novelManager)
  const novelController = new NovelController(novelManager)

  const init = useCallback(async () => {
    await novelController.initScene({ name: 'chapter1' })
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return <></>
}
