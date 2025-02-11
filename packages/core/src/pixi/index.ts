import { initDevtools } from '@pixi/devtools'
import { soundAsset } from '@pixi/sound'
import { Application, extensions } from 'pixi.js'

export class PixiInstance {
  public app: Application

  constructor() {
    this.app = new Application()
  }

  async install(canvas: HTMLCanvasElement) {
    // BUG：resizeTo 重定义
    try {
      if (!this.isAppInitialized()) {
        await this.app.init({
          canvas,
          backgroundAlpha: 0,
          resizeTo: canvas,
          antialias: false,
          // resolution: window.devicePixelRatio,
        })
        extensions.add(soundAsset)
        initDevtools({ app: this.app })
      }
    } catch (error) {
      // console.log(err)
    } finally {
      this.app.resize()
    }

    return this.app
  }

  async watchInit() {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.isAppInitialized()) {
          clearInterval(timer)
          resolve(true)
        }
      }, 100)
    })
  }

  // 判断 app 是否已经初始化并附加到 canvas
  isAppInitialized(): boolean {
    let isInit = false
    // 检查 app.view 是否已经挂载到 DOM
    try {
      const canvas = this.app && this.app?.canvas
      if (canvas && canvas.parentNode != null) {
        isInit = true
      }
    } catch (error) {
      isInit = false
    }

    return isInit
  }
}
