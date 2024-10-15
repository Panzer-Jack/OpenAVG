import type { ObservablePoint, Sprite } from 'pixi.js'
import { Easing, Tween } from '@tweenjs/tween.js'
import { cloneDeep } from 'lodash'

// 使用 TweenJS 调整缩放
function adjustScaleWithTween({
  sprite,
  targetScale,
  duration,
}: {
  sprite: Sprite
  targetScale: ObservablePoint
  duration: number
}) {
  return new Tween({ scaleX: sprite.scale.x, scaleY: sprite.scale.y })
    .to({ scaleX: targetScale.x, scaleY: targetScale.y }, duration) // 设置目标缩放值和动画时长
    .easing(Easing.Quadratic.InOut) // 选择缓动函数
    .onUpdate(({ scaleX, scaleY }) => {
      sprite.scale.set(scaleX, scaleY) // 更新 Sprite 的缩放比例
    })
}

// 放大然后缩小的效果
export async function scaleToNormal({
  sprite,
  initialScale = 3, // 默认从 3 倍大小开始
  duration = 1000, // 默认 1 秒动画
}: {
  sprite: Sprite
  initialScale?: number
  duration?: number
}) {
  // 设置目标
  const targetScale = cloneDeep(sprite.scale)

  // 先设置初始的缩放值
  sprite.scale.set(initialScale)

  // 使用 TweenJS 逐渐缩小到 1 倍大小
  return adjustScaleWithTween({ sprite, targetScale, duration })
}
