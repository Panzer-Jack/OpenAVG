import type {
  Texture,
} from 'pixi.js'
import { Button } from '@pixi/ui'
import { Easing, Tween } from '@tweenjs/tween.js'
import {
  Color,
  FillGradient,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js'
import { centerView } from '../utils/layout'

interface ButtonProps {
  text: string
  textColor?: string
  disabled?: boolean
  onClick?: () => void
  action?: (event: string) => void
  colors?: {
    disable?: string
    default?: string
    hover?: string
    press?: string
  }
}

export class CommonButton extends Button {
  private textView: Text
  private buttonView = new Sprite()
  private action: (event: string) => void
  private onClick: () => void

  box: Graphics
  tween: Tween
  disabled = false
  colors: {
    default: string
    hover: string
    press: string
    disabled: string
  }

  constructor(props: ButtonProps) {
    super()
    this.view = this.buttonView
    this.disabled = props.disabled

    // 设置默认颜色配置
    this.colors = {
      default: props.colors?.default || 'rgb(255, 228, 235, 0.8)',
      hover: props.colors?.hover || 'rgb(255, 200, 200, 1)',
      press: props.colors?.press || 'rgb(200, 0, 0, 1)',
      disabled: props.colors?.disable || 'rgb(180, 180, 180, 1)',
    }

    const box = new Graphics()
    this.box = box
    if (props.disabled) {
      this.setButtonFillColor(this.colors.disabled)
    } else {
      this.setButtonFillColor(this.colors.default)
    }

    this.buttonView.addChild(box)

    const nameStyle = new TextStyle({
      fontFamily: 'Cochin',
      fontSize: 40,
      fill: props.textColor || 'black',
      fontWeight: 'bold',
    })

    this.textView = new Text({
      text: props.text,
      style: nameStyle,
    })

    centerView({
      view: this.textView,
      target: box,
    })

    this.buttonView.addChild(this.textView)
    this.tween = new Tween(this.buttonView.scale)

    this.enabled = !props.disabled
    if (props.action) {
      this.action = props.action
    }
    if (props.onClick) {
      this.onClick = props.onClick
    }
  }

  // 处理不同状态的颜色变化
  setButtonFillColor(color: string) {
    // 对话框大小
    const boxReact = {
      width: 300,
      height: 80,
      radius: 100,
    }

    this.box.clear()

    const gradientFill = new FillGradient(0, 0, 0, 80)
    if (this.disabled) {
      gradientFill.addColorStop(0, new Color(color))
    } else {
      gradientFill.addColorStop(0, new Color('rgb(255, 228, 235, 0.6)'))
    }
    gradientFill.addColorStop(1, new Color(color))
    this.box
      .roundRect(0, 0, boxReact.width, boxReact.height, boxReact.radius)
      .fill(gradientFill)
  }

  override down() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.press)
    if (this.action) {
      this.action('down')
    }
  }

  override up() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.default)
    if (this.action) {
      this.action('up')
    }
  }

  override upOut() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.default)
    if (this.action) {
      this.action('upOut')
    }
  }

  override out() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.default)
    if (this.action) {
      this.action('out')
    }
  }

  override press() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.press)
    if (this.action) {
      this.action('onPress')
    }
    this.onClick()
  }

  override hover() {
    this.tween.stop()
    this.tween.to({ x: 1.1, y: 1.1 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.hover)
    if (this.action) {
      this.action('hover')
    }
  }
}

export class SpriteButton extends Button {
  private textView: Text
  private textures: {
    default: Texture
    pressed?: Texture
    hover?: Texture
  }

  private buttonView = new Sprite()
  private action: (event: string) => void

  constructor(props: {
    text: string
    textColor?: string
    disabled: boolean
    textures: {
      default: Texture
      pressed?: Texture
      hover?: Texture
    }
    action: (event: string) => void
  }) {
    super()

    this.view = this.buttonView

    this.buttonView.texture = this.textures.default

    this.buttonView.anchor.set(0.5)

    const nameStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 40,
      fill: 'green',
      fontWeight: 'bold',
    })

    this.textView = new Text({
      text: props.text,
      style: nameStyle,
    })
    this.textView.y = -10
    this.textView.anchor.set(0.5)

    this.buttonView.addChild(this.textView)

    this.enabled = !props.disabled

    this.action = props.action
  }

  override down() {
    this.action('down')
  }

  override up() {
    this.action('up')
  }

  override upOut() {
    this.action('upOut')
  }

  override out() {
    this.action('out')
  }

  override press() {
    this.action('onPress')
  }

  override hover() {
    this.action('hover')
  }
}
