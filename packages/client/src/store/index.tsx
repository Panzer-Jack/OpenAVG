import type { StageType } from '@openavg/core'
import type { MenuLayerManager } from '@openavg/core/src/stage/menu-layer'
import type { NovelLayerManager } from '@openavg/core/src/stage/novel-layer'
import type { IGlobalConfig } from '@openavg/types'
import { stageManager } from '@openavg/core'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export const useGlobalConfig = create(
  combine(
    {
      config: {} as IGlobalConfig,
    },
    set => ({
      setGlobalConfig: (config: IGlobalConfig) => set(() => ({ config })),
    }),
  ),
)

export const useLoader = create(
  combine(
    {
      coreOnload: false,
      assetsOnload: false,
      pixiOnload: false,
    },
    (set, get) => ({
      setCoreOnload: (coreOnload: boolean) => set(() => ({ coreOnload })),
      setAssetsOnload: (assetsOnload: boolean) =>
        set(() => ({ assetsOnload })),
      setPixiOnload: (pixiOnload: boolean) => set(() => ({ pixiOnload })),
      isInit: () => get().coreOnload && get().pixiOnload,
    }),
  ),
)

export const useManagers = create(
  combine(
    {
      stageManager: {} as typeof stageManager,
      novelManager: {} as NovelLayerManager,
      menuManager: {} as MenuLayerManager,
    },
    set => ({
      initManagers: () =>
        set(() => ({
          stageManager,
          novelManager: stageManager.layerManagers.novelLayer,
          menuManager: stageManager.layerManagers.menuLayer,
        })),
    }),
  ),
)

export const useGlobalSignals = create(
  combine(
    {
      currentStage: stageManager.currentStage,
    },
    set => ({
      setCurrentStage: (currentStage: StageType) => set(() => ({ currentStage })),
    }),
  ),
)

export const useVolumeConfig = create(
  combine(
    {
      mainVolume: 100,
      bgmVolume: 40,
      voiceVolume: 100,
    },
    set => ({
      setMainVolume: (mainVolume: number) => set(() => ({ mainVolume })),
      setBgmVolume: (bgmVolume: number) => set(() => ({ bgmVolume })),
      setVoiceVolume: (voiceVolume: number) => set(() => ({ voiceVolume })),
    }),
  ),
)

useVolumeConfig.subscribe((state) => {
  const targetsVolume = {
    bgm: state.bgmVolume / 100,
    voice: state.voiceVolume / 100,
    main: state.mainVolume / 100,
  }
  stageManager.soundManager.setVolume(targetsVolume)
})
