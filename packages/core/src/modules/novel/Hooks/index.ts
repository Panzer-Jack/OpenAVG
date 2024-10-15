// 单例模型: Novel内 全局钩子 Hooks
import type { Application, Sprite } from 'pixi.js'
import type { AssetsPacks } from '../../../managers/assets-manager/assetsConfig'
import type { SceneManager } from '../managers/scene-manager'
import { resizeToCanvas } from '../../../utils/resize'

export default class Hooks {
  private static instance: Hooks | null = null

  app: Application
  sceneManager: SceneManager

  assetsPack: AssetsPacks

  // 私有构造函数，防止外部直接实例化
  private constructor() {
    console.warn(
      'Hooks is a singleton class. Use Hooks.getInstance() instead.',
    )
  }

  // 获取唯一实例的静态方法
  public static getInstance(): Hooks {
    if (!Hooks.instance) {
      Hooks.instance = new Hooks()
    }
    return Hooks.instance
  }

  // 背景图片自适应屏幕，但不超出屏幕
  resizeImage({ image }: { image: Sprite }) {
    resizeToCanvas({ image, app: this.app })
    return image
  }
}
