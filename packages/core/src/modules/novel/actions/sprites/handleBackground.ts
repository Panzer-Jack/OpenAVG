import type { IBackground, IBgFilter } from '@openavg/types'
import type { Tween } from '@tweenjs/tween.js'
import type { Texture } from 'pixi.js'

import { AlphaFilter, Sprite } from 'pixi.js'
import { fadeIn, fadeOut } from '../../../../filters/fade'
import { tickerManager } from '../../../../managers/ticker-manager'
import Hooks from '../../Hooks'

export async function handleBackground({
  assetName,
}: {
  assetName: IBackground
}) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve) => {
    const hooks = Hooks.getInstance()
    const sceneManager = hooks.sceneManager
    let bgAssets: Texture | undefined
    let fadeOutTween: Tween | undefined
    let fadeInTween: Tween | undefined

    if (
      sceneManager.currentScene.background
      && sceneManager.currentScene.background.filters
    ) {
      fadeOutTween = await fadeOut({
        filter: sceneManager.currentScene.background.filters[0],
      })
    }

    const callback = async () => {
      // 判定是否销毁精灵
      if (assetName === '') {
        sceneManager.currentScene.background.destroy()
        sceneManager.currentScene.backgroundAction = null
      } else {
        if (typeof assetName === 'string') {
          bgAssets = hooks.assetsPack.SPRITE_TEXTURE[assetName]
        } else {
          bgAssets = hooks.assetsPack.SPRITE_TEXTURE[assetName.name]
        }
        const bgSprite = new Sprite(bgAssets)

        const alphaFilter = new AlphaFilter()
        const bgFilter: IBgFilter = [alphaFilter]

        bgSprite.filters = bgFilter
        hooks.resizeImage({ image: bgSprite })
        sceneManager.sceneContainers.background.addChild(bgSprite)
        fadeInTween = await fadeIn({
          filter: bgSprite.filters[0] as AlphaFilter,
        })

        fadeInTween = fadeInTween.onComplete(() => {
          tickerManager.removeListener('handleBgFadeIn')
        }).start()

        tickerManager.addListener('handleBgFadeIn', () => {
          fadeInTween?.update()
        })
        // 如果之前存在则销毁
        if (sceneManager.currentScene.background) {
          sceneManager.currentScene.background.destroy()
          sceneManager.currentScene.backgroundAction = null
        }
        sceneManager.currentScene.background = bgSprite
        sceneManager.currentScene.backgroundAction = assetName
        resolve()
      }
    }

    if (fadeOutTween) {
      fadeOutTween.onComplete(() => {
        callback()
        tickerManager.removeListener('handleBgFadeOut')
      }).start()
      tickerManager.addListener('handleBgFadeOut', () => {
        fadeOutTween?.update()
      })
    } else {
      callback()
    }
  })
}
