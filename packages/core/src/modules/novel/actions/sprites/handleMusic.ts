import type { IMusic } from '@openavg/types'
import type { Sound } from '@pixi/sound'

import Hooks from '../../Hooks'

export function handleMusic({ assetName }: { assetName: IMusic }) {
  const hooks = Hooks.getInstance()
  let audioSprite: Sound

  if (typeof assetName === 'string') {
    audioSprite = hooks.assetsPack.GAME_AUDIO[assetName]
  } else {
    audioSprite = hooks.assetsPack.GAME_AUDIO[assetName.name]
    const { name, ...options } = assetName
    for (const key in options) {
      switch (key) {
        case 'destroy':
          audioSprite.destroy()
          hooks.sceneManager.currentScene.music = null
          return
        case 'pause':
          audioSprite.pause()
          hooks.sceneManager.currentScene.music = null
          return
        case 'stop':
          audioSprite.stop()
          hooks.sceneManager.currentScene.music = null
          return
      }
      audioSprite[key] = options[key]
    }
  }
  audioSprite.play()
  hooks.sceneManager.currentScene.music = audioSprite
}
