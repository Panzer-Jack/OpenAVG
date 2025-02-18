import type { TextStyleFontWeight } from 'pixi.js'
import { Button } from '@pixi/ui'
import { Easing, Tween } from '@tweenjs/tween.js'
import { debounce } from 'lodash'
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
  onClick: () => void
  onClickAfter?: () => void
  action?: (event: string) => void
  colors?: {
    disable?: string
    default?: string
    hover?: string
    press?: string
  }
  height?: number
  width?: number
  size?: SizeType
  type?: TypeType
  fontSize?: number
  fontWeight?: string
  backgroundColor?: string
  noGradient?: boolean
  textOffset?: { x?: number, y?: number }
  checked?: boolean
}

type SizeType = 'big' | 'middle' | 'small'
type TypeType = 'round' | 'rectangle' | 'text'

export class CommonButton extends Button {
  private textView: Text
  private buttonView = new Sprite()
  private action: (event: string) => void
  onClick: () => void
  private _checked = false
  onClickAfter: () => void

  box: Graphics
  tween: Tween
  disabled = false
  colors: {
    default: string
    hover: string
    press: string
    disabled: string
  }

  type = 'round'
  size = 'middle'
  noGradient: boolean = false // 新增参数，控制是否使用渐变
  width = 200
  height = 60

  textOffset = { x: 0, y: 0 }

  constructor(props: ButtonProps) {
    super()
    this.view = this.buttonView
    this.disabled = props.disabled
    this.noGradient = props.noGradient || false // 默认为 false，表示使用渐变

    // 设置默认颜色\种类\大小配置
    this.colors = {
      default: props.colors?.default || 'rgb(255, 228, 235, 0.8)',
      hover: props.colors?.hover || 'rgb(255, 200, 200, 1)',
      press: props.colors?.press || 'rgb(200, 0, 0, 1)',
      disabled: props.colors?.disable || 'rgb(180, 180, 180, 1)',
    }
    props.size && (this.size = props.size)
    props.type && (this.type = props.type)
    props.checked && (this.checked = props.checked)
    this.onClickAfter = props.onClickAfter || (() => null)

    props.textOffset
    && props.textOffset.x && (this.textOffset.x = props.textOffset.x)
    props.textOffset
    && props.textOffset.y && (this.textOffset.y = props.textOffset.y)

    let fontSize = 30
    if (this.size === 'big') {
      fontSize = 40
    } else if (this.size === 'small') {
      fontSize = 20
    }
    props.fontSize && (fontSize = props.fontSize)

    const box = new Graphics()
    this.box = box
    if (this.disabled) {
      this.setButtonFillColor(this.colors.disabled, props.width, props.height)
    } else if (this.checked) {
      this.setButtonFillColor(this.colors.press, props.width, props.height)
    } else {
      this.setButtonFillColor(this.colors.default, props.width, props.height)
    }

    this.buttonView.addChild(box)

    // TextStyle for pure text button
    const nameStyle = new TextStyle({
      fontFamily: 'Cochin',
      fontSize,
      fill: props.textColor || 'black',
      fontWeight: (props.fontWeight || 'bold') as TextStyleFontWeight,
    })

    this.textView = new Text({
      text: props.text,
      style: nameStyle,
    })

    // If type is 'text', we don't need any box for background
    if (this.type === 'text') {
      this.buttonView.removeChild(this.box) // Remove the background box
      this.textView.position.set(0, 0) // Positioning the text without the background box
    }

    centerView({
      view: this.textView,
      target: box,
      offset: this.textOffset,
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

  get checked() {
    return this._checked
  }

  set checked(newVal) {
    this._checked = newVal
    if (newVal) {
      this.setButtonFillColor(this.colors.press, this.width, this.height)
    } else {
      this.setButtonFillColor(this.colors.default, this.width, this.height)
    }
  }

  // 处理不同状态的颜色变化
  setButtonFillColor(color: string, width?: number, height?: number) {
    if (this.type === 'text')
      return // If it's a text button, skip filling the background

    // 对话框大小
    const radius = this.type === 'round' ? 100 : 0

    if (this.size === 'small') {
      this.width = 100
      this.height = 40
    } else if (this.size === 'big') {
      this.width = 300
      this.height = 80
    }

    width && (this.width = width)
    height && (this.height = height)

    const boxReact = {
      width: this.width,
      height: this.height,
      radius,
    }

    if (this.box) {
      this.box.clear()
      if (this.noGradient) {
      // 如果 noGradient 为 true，使用纯色填充
        this.box.beginFill(new Color(color)).roundRect(0, 0, boxReact.width, boxReact.height, boxReact.radius).endFill()
      } else {
      // 否则，使用渐变填充
        const gradientFill = new FillGradient(0, 0, 0, 80)
        if (this.disabled) {
          gradientFill.addColorStop(0, new Color(color))
        } else {
          gradientFill.addColorStop(0, new Color('rgb(255, 228, 235, 0.6)'))
        }
        gradientFill.addColorStop(1, new Color(color))
        this.box.roundRect(0, 0, boxReact.width, boxReact.height, boxReact.radius).fill(gradientFill)
      }
    }
  }

  override down() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.press, this.width, this.height)
    if (this.action) {
      this.action('down')
    }
  }

  override up() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    if (this.checked) {
      this.setButtonFillColor(this.colors.press, this.width, this.height)
    } else {
      this.setButtonFillColor(this.colors.default, this.width, this.height)
    }
    if (this.action) {
      this.action('up')
    }
  }

  override upOut() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    if (this.checked) {
      this.setButtonFillColor(this.colors.press, this.width, this.height)
    } else {
      this.setButtonFillColor(this.colors.default, this.width, this.height)
    }
    if (this.action) {
      this.action('upOut')
    }
  }

  override out() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    if (this.checked) {
      this.setButtonFillColor(this.colors.press, this.width, this.height)
    } else {
      this.setButtonFillColor(this.colors.default, this.width, this.height)
    }
    if (this.action) {
      this.action('out')
    }
  }

  override press() {
    this.tween.stop()
    this.tween.to({ x: 1, y: 1 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.press, this.width, this.height)
    if (this.action) {
      this.action('onPress')
    }

    (debounce(() => {
      this.onClick()
      this.onClickAfter()
    }, 100))()
  }

  override hover() {
    this.tween.stop()
    this.tween.to({ x: 1.02, y: 1.02 }).easing(Easing.Back.Out).start()
    this.setButtonFillColor(this.colors.hover, this.width, this.height)
    if (this.action) {
      this.action('hover')
    }
  }
}

export class ButtonGroup {
  buttons: CommonButton[] = [] // 存储按钮
  private selectedButton: CommonButton | null = null // 当前选中的按钮

  constructor(buttons: CommonButton[]) {
    this.buttons = buttons
    this.initializeButtons() // 初始化按钮组
  }

  // 初始化按钮，设置按钮点击后的回调
  private initializeButtons() {
    this.buttons.forEach((button) => {
      button.onClickAfter = () => this.handleButtonClick(button) // 设置点击后的回调
    })
  }

  // 处理按钮点击事件
  private handleButtonClick(clickBtn) {
    this.buttons.forEach((button) => {
      if (button !== clickBtn) {
        this.deselectButton(button)
      } else {
        this.selectButton(button)
      }
    })
  }

  // 选中按钮
  private selectButton(button: CommonButton) {
    button.checked = true // 设置按钮为选中状态
    this.selectedButton = button // 更新当前选中的按钮
  }

  // 取消选中按钮
  private deselectButton(button: CommonButton) {
    this.selectedButton = null // 清空当前选中的按钮
    button.checked = false // 设置按钮为未选中状态
  }

  // 获取当前选中的按钮
  public getSelectedButton() {
    return this.selectedButton
  }
}
