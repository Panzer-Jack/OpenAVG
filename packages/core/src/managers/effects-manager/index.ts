import type { IEffect } from '@openavg/types'
import type { Application } from 'pixi.js'

class EffectsManager {
  app: Application
  effects = new Map<string, IEffect>()

  constructor() {}

  init(app: Application) {
    this.app = app
    return this
  }

  install({ name, effect }: { name: string, effect: IEffect }) {
    this.effects.set(name, effect)
  }

  stopAll() {
    this.effects.forEach((effect) => {
      effect.stop(this.app)
    })
  }

  start(name: string) {
    const effect = this.effects.get(name)
    if (effect) {
      effect.start(this.app)
    }
  }

  stop(name: string) {
    const effect = this.effects.get(name)
    if (effect) {
      effect.stop(this.app)
    }
  }
}

export const effectsManager = new EffectsManager()
