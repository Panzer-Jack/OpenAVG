import type { ITalk } from '@openavg/types'
import type {
  Application,
  Sprite,
} from 'pixi.js'
import {
  Color,
  Container,
  FillGradient,
  Graphics,
  Text,
  TextStyle,
} from 'pixi.js'

export class DialogueBox {
  container = new Container({
    label: 'Dialogue',
  })

  app: Application

  // 控件
  box: Graphics
  sentenceText: Text
  speakerNameText: Text

  // 样式
  colorStops: Array<number> = [0xFFFFFF, 0x000000]
  boxHeight = 300
  gradientFill: FillGradient
  fontSize = 35

  // 是否渲染
  isRendered = false

  // 是否打字中
  isTyping = false
  typeTimer = null

  // 缓存对话
  sentence: string

  constructor({ app }: { app: Application }) {
    this.app = app
  }

  // 渲染
  render() {
    if (!this.isRendered) {
      this._render()
    }
  }

  reset() {
    this.container.removeChildren()
    this.isRendered = false
  }

  hide() {
    this.container.visible = false
  }

  show() {
    this.container.visible = true
  }

  // 渲染对话框
  private _render() {
    // canvas大小
    const canvasRect = {
      x: this.app.screen.x,
      y: this.app.screen.y,
      width: this.app.screen.width,
      height: this.app.screen.height - this.boxHeight,
    }
    // 对话框大小
    const boxReact = {
      x: 50,
      y: canvasRect.height - 10,
      width: this.app.screen.width - 100,
      height: this.boxHeight,
      radius: 100,
    }

    this.gradientFill = new FillGradient(0, 0, 0, 0.2)
    this.gradientFill.addColorStop(0, new Color('rgb(200, 200, 200, 0)'))
    this.gradientFill.addColorStop(0.5, new Color('rgb(0, 0, 0, 0.3)'))
    this.gradientFill.addColorStop(1, new Color('rgb(0, 0, 0, 0.8)'))

    this.box = new Graphics()
      .roundRect(
        boxReact.x,
        boxReact.y,
        boxReact.width,
        boxReact.height,
        boxReact.radius,
      )
      .fill(this.gradientFill)

    // 角色名字文本样式
    const nameStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: this.fontSize,
      fill: 0xFFFFFF, // 白色
      fontWeight: 'bold',
    })

    // 角色名字显示
    this.speakerNameText = new Text({
      text: '',
      style: nameStyle,
    })
    this.speakerNameText.position.x = boxReact.x + 300
    this.speakerNameText.position.y = boxReact.y + 30

    // 对话内容文本样式
    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: this.fontSize,
      letterSpacing: 2, // 水平字母间距
      lineHeight: 50, // 垂直行间距
      fill: 0xFFFFFF, // 白色
      wordWrap: true,
      wordWrapWidth: boxReact.width - this.speakerNameText.position.x,
      breakWords: true,
    })

    // 对话文本显示
    this.sentenceText = new Text({
      text: '',
      style: textStyle,
    })
    this.sentenceText.x = this.speakerNameText.position.x
    this.sentenceText.y
      = this.speakerNameText.position.y + this.fontSize + 20

    // 渲染
    this.container.addChild(this.box)
    this.container.addChild(this.speakerNameText)
    this.container.addChild(this.sentenceText)

    this.isRendered = true
  }

  // 更新对话框的内容
  updateDialogue({ speaker, sentence }: ITalk) {
    if (speaker.avatars.length) {
      this.showAvator(speaker.avatars)
    }
    this.speakerNameText.text = speaker.name // 更新名字
    this.sentence = `「\u00A0${sentence}\u00A0」`
    this.typeWriter() // 更新对话内容
  }

  showAvator(avatars: Sprite[]) {
    avatars.forEach((avatar) => {
      this.resizeAvator(avatar)
      this.container.addChild(avatar)
    })
  }

  // 自动缩放头像
  resizeAvator(avatar: Sprite) {
    const box = this.box
    const boxHeight = box.height

    const scaleY = boxHeight / avatar.texture.height
    avatar.scale.set(scaleY)
    avatar.position.x = this.speakerNameText.position.x - avatar.width
    avatar.position.y = this.app.screen.height - avatar.height

    return avatar
  }

  typeWriter() {
    let currentIndex = 0
    this.isTyping = true
    this.sentenceText.text = ''
    // 每次增加一个字符到文本
    this.typeTimer = setInterval(() => {
      if (currentIndex < this.sentence.length) {
        this.sentenceText.text += this.sentence[currentIndex++]
      } else {
        this.isTyping = false
        clearInterval(this.typeTimer)
        this.typeTimer = null
      }
    }, 50)
  }

  skipType() {
    if (this.isTyping) {
      this.isTyping = false
      clearInterval(this.typeTimer)
      this.typeTimer = null
      this.sentenceText.text = this.sentence
    }
  }
}
