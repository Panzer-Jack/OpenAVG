import type { Application, Ticker } from 'pixi.js'

class TickerManager {
  app: Application
  ticker: Ticker
  listeners: Map<string, () => void>

  constructor() {
    this.listeners = new Map()
  }

  init(app: Application) {
    this.ticker = app.ticker
    return this
  }

  addListener(id: string, callback: () => void) {
    if (!this.listeners.has(id)) {
      this.ticker.add(callback)
      this.listeners.set(id, callback)
    } else {
      console.warn(`Listener with ID ${id} already exists.`)
    }
  }

  removeListener(id: string) {
    const callback = this.listeners.get(id)
    if (callback) {
      this.ticker.remove(callback)
      this.listeners.delete(id)
    }
  }

  clearListeners() {
    this.listeners.forEach((callback) => {
      this.ticker.remove(callback)
    })
    this.listeners.clear()
  }

  hasListener(id: string): boolean {
    return this.listeners.has(id)
  }
}

export const tickerManager = new TickerManager()
