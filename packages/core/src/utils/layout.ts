import type { Container, Sprite } from 'pixi.js'

// 水平布局
export function row(
  elements: Array<Sprite>, // 假设按钮是 Sprite 类型或有 anchor 属性的对象
  spacing: number = 400, // 元素之间的间距
) {
  let currentX = 0 // 初始的 X 位置，表示从哪里开始布局

  elements.forEach((element) => {
    // 将当前元素放置在当前的 X 位置
    element.x = currentX + element.width / 2 // 计算中心点

    // 更新下一个元素的 X 位置
    currentX += element.width + spacing
  })
}

// 居中
export function centerView({
  pos = 'all',
  view,
  target,
  global = false,
  offset = { x: 0, y: 0 }, // 新增偏移参数
}: {
  pos?: 'x' | 'y' | 'all'
  view: Container | Sprite
  target: Container | Sprite
  global?: boolean
  offset?: { x: number, y: number } // 偏移类型
}) {
  if (global) {
    view.position.x = (1920 - view.width) / 2 + offset.x
    view.position.y = (1080 - view.height) / 2 + offset.y
  } else {
    if (pos === 'x' || pos === 'all') {
      view.position.x = (target.width - view.width) / 2 + offset.x
    }
    if (pos === 'y' || pos === 'all') {
      view.position.y = (target.height - view.height) / 2 + offset.y
    }
  }
}
