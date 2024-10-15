import type { AlphaFilter } from 'pixi.js'
import { Easing, Tween } from '@tweenjs/tween.js'

// 使用 TweenJS 调整透明度
function adjustAlphaWithTween({
  filter,
  targetAlpha,
  duration,
}: {
  filter: AlphaFilter
  targetAlpha: number
  duration: number
}) {
  return new Tween({ alpha: filter.alpha })
    .to({ alpha: targetAlpha }, duration) // 设置目标 alpha 值和动画时长
    .easing(Easing.Quadratic.InOut) // 选择缓动函数
    .onUpdate(({ alpha }) => {
      filter.alpha = alpha // 更新滤镜的 alpha 值
    })
}

// 淡入效果
export async function fadeIn({
  filter,
  duration = 1000, // 默认 1 秒
}: {
  filter: AlphaFilter
  duration?: number
}) {
  filter.alpha = 0
  return adjustAlphaWithTween({ filter, targetAlpha: 1, duration })
}

// 淡出效果
export async function fadeOut({
  filter,
  duration = 1000, // 默认 1 秒
}: {
  filter: AlphaFilter
  duration?: number
}) {
  filter.alpha = 1
  return adjustAlphaWithTween({ filter, targetAlpha: 0, duration })
}
