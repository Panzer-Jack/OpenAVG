import { Stage } from '@/stage'
import { useGlobalConfig, useLoader, useManagers } from '@/store'

import { fetchChapter, fetchGlobalConfig } from '@/utils/api'
import { openAVGCore } from '@openavg/core'
import { useCallback, useEffect, useRef } from 'react'

import 'virtual:uno.css'
import './App.css'

function StartGame() {
  const setCoreOnload = useLoader(store => store.setCoreOnload)
  const setGlobalConfig = useGlobalConfig(store => store.setGlobalConfig)
  const initManagers = useManagers(store => store.initManagers)
  const isLoading = useRef(false) // 防止重复读取

  const init = useCallback(async () => {
    if (!isLoading.current) {
      isLoading.current = true
      const config = await fetchGlobalConfig()
      setGlobalConfig(config)
      if (config) {
        await openAVGCore.init(config, {
          fetchChapter,
          fetchGlobalConfig,
        })
        initManagers()
      }
      setCoreOnload(true)
    }
    isLoading.current = false
  }, [initManagers, setCoreOnload, setGlobalConfig])

  useEffect(() => {
    init()
  }, [init])

  return (
    <div id="game-root">
      <Stage />
    </div>
  )
}

export default StartGame
