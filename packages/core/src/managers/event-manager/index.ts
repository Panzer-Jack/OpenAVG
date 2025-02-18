import type { IEvent } from '@openavg/types'
import type { Application } from 'pixi.js'
import { stageManager } from '../../stage'

class EventManager {
  app: Application
  stageManager: typeof stageManager
  events: Map<string, IEvent<typeof stageManager>> = new Map()
  isActive = false

  constructor() { }

  init(app: Application) {
    this.app = app
    this.stageManager = stageManager
    return this
  }

  active() {
    // 全局监听事件
    if (!this.isActive) {
      this.isActive = true
      this.events.forEach((event) => {
        event({ app: this.app, stageManager: this.stageManager })
      })
    }
  }

  emit(eventName: string, ...args: any) {
    // 个别事件
    this.events.get(eventName)?.({
      app: this.app,
      stageManager: this.stageManager,
      ...args,
    })
  }

  install({
    name,
    event,
  }: {
    name: string
    event: IEvent<typeof stageManager>
  }) {
    this.events.set(name, event)
  }

  uninstall(name: string) {
    this.events.delete(name)
  }
}

export const eventManager = new EventManager()
