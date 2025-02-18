import type { IImage } from '@openavg/types'

import { Sprite } from 'pixi.js'
import { scaleToBottom } from '../../../../utils/resize'
import Hooks from '../../Hooks'

export async function handleImages({
  assetName,
}: {
  assetName: IImage[]
}) {
  const hooks = Hooks.getInstance()
  const sceneManager = hooks.sceneManager
  const imagesSprite: Sprite[] = []

  // 如果之前存在则销毁
  if (sceneManager.currentScene.images) {
    sceneManager.currentScene.images.forEach((imageSprite) => {
      imageSprite.destroy()
    })
    sceneManager.currentScene.imagesAction = []
  }

  for (let i = 0; i < assetName.length; i++) {
    const asset = assetName[i]
    const imagesAssets = hooks.assetsPack.SPRITE_TEXTURE[asset.name]
    const imageSprite = new Sprite(imagesAssets)

    if (asset.position === 'center') {
      scaleToBottom({
        pos: asset.position,
        view: imageSprite,
        target: sceneManager.container,
      })
    }

    imagesSprite[i] = imageSprite
    sceneManager.sceneContainers.images.addChild(imageSprite)
  }

  sceneManager.currentScene.images = imagesSprite
  sceneManager.currentScene.imagesAction = assetName
}
