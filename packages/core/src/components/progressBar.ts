import type { Container } from 'pixi.js'
import { List, ProgressBar } from '@pixi/ui'
import { Graphics, Text, TextStyle } from 'pixi.js'

import { centerView } from '../utils/layout'

interface ProgressBarProps {
  fillColor: string
  backgroundColor: string
  borderColor: string
  width: number
  height: number
  radius: number
  border: number
  value: number
  animate: boolean
  vertical: boolean
  text: string
}

export class GlobalProgressBar {
  private progressBar: ProgressBar
  private textView: Text
  private value: number
  private isFilling: boolean = true
  private animate: boolean
  view: List
  fatherContainer: Container

  constructor(fatherContainer: Container, options: ProgressBarProps) {
    this.value = options.value
    this.animate = options.animate

    this.view = new List({ type: 'vertical', elementsMargin: 10 })
    this.fatherContainer = fatherContainer

    // 创建背景和填充
    const bg = new Graphics()
      .roundRect(0, 0, options.width, options.height, options.radius)
      .fill(options.borderColor)
      .roundRect(options.border, options.border, options.width - options.border * 2, options.height - options.border * 2, options.radius)
      .fill(options.backgroundColor)

    const fill = new Graphics()
      .roundRect(0, 0, options.width, options.height, options.radius)
      .fill(options.borderColor)
      .roundRect(options.border, options.border, options.width - options.border * 2, options.height - options.border * 2, options.radius)
      .fill(options.fillColor)

    this.progressBar = new ProgressBar({
      bg,
      fill,
      progress: options.value,
    })

    if (options.vertical) {
      this.progressBar.rotation = -Math.PI / 2
    }

    this.view.addChild(this.progressBar)

    // 创建加载中的文字提示
    this.textView = new Text({
      text: options.text,
      style: new TextStyle({
        fontSize: 20,
        fill: '#ffffff',
      }),
    })

    this.textView.anchor.set(0.5)
    this.textView.position.set(options.width / 2, options.height / 2)

    this.progressBar.addChild(this.textView)

    centerView({
      view: this.view,
      target: this.fatherContainer,
      global: true,
    })

    this.fatherContainer.addChild(this.view)
  }

  public remove() {
    this.fatherContainer.removeChild(this.view)
  }

  public update(value: number, text?: string) {
    this.value = value
    this.textView.text = text

    if (!this.animate) {
      return
    }

    this.isFilling ? this.value++ : this.value--

    if (this.value > 150) {
      this.isFilling = false
    } else if (this.value < -50) {
      this.isFilling = true
    }

    this.progressBar.progress = this.value
  }
}
