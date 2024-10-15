import type { IPosition } from '@openavg/types'
import type { Application, Container, Sprite } from 'pixi.js'

// 背景图片自适应屏幕，但不超出屏幕
export function resizeToCanvas({
  image,
  app,
}: {
  image: Sprite
  app: Application
}) {
  const screenWidth = app.screen.width
  const screenHeight = app.screen.height

  // 计算适应屏幕的缩放比例
  const scaleX = screenWidth / image.texture.width
  const scaleY = screenHeight / image.texture.height
  const scale = Math.min(scaleX, scaleY) // 选择较小的缩放比例，避免超出屏幕

  // 设置缩放比例
  image.scale.set(scale)

  // 设置锚点为中心，确保从中间进行缩放
  image.anchor.set(0.5)

  // 将图片居中显示
  image.x = screenWidth / 2
  image.y = screenHeight / 2

  return image
}

// 居中放大到底边
export function scaleToBottom({
  pos,
  view,
  target,
}: {
  pos: IPosition
  view: Container | Sprite
  target: Container | Sprite
}) {
  // 计算放大比例，使得 view 的底边与 target 的底边对齐
  const scaleFactor = target.height / view.height
  view.scale.set(scaleFactor)

  switch (pos) {
    case 'center':
      view.position.x = (target.width - view.width) / 2
      break
    case 'left':
      view.position.x = 0
      break
    case 'right':
      view.position.x = target.width - view.width
      break
    default:
      break
  }

  // 更新 y 方向的居中位置，并将其底边与 target 底边对齐
  view.position.y = target.height - view.height
}
