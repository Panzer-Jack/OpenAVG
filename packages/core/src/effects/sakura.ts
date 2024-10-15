import type {
  Application,
} from 'pixi.js'
import {
  Container,
  Sprite,
  Texture,
} from 'pixi.js'
import { effectsManager } from '../managers/effects-manager'
import { tickerManager } from '../managers/ticker-manager'

let tickerCB: () => void

interface SakuraFunction {
  x: (x: number, y: number) => number
  y: (x: number, y: number) => number
  r: (r: number) => number
}

class Sakura {
  x: number
  y: number
  s: number
  r: number
  fn: SakuraFunction
  sprite: Sprite

  constructor(
    x: number,
    y: number,
    s: number,
    r: number,
    fn: SakuraFunction,
  ) {
    this.x = x
    this.y = y
    this.s = s
    this.r = r
    this.fn = fn
    this.sprite = new Sprite(
      Texture.from('demo/resource/images/specEffect.png'),
    )
    this.sprite.anchor.set(0.5)
    this.sprite.scale.set(this.s * 0.1) // Adjust scale according to 's'
    this.sprite.rotation = this.r
    this.sprite.x = this.x
    this.sprite.y = this.y
  }

  update() {
    this.x = this.fn.x(this.x, this.y)
    this.y = this.fn.y(this.y, this.y)
    this.r = this.fn.r(this.r)
    this.sprite.x = this.x
    this.sprite.y = this.y
    this.sprite.rotation = this.r

    if (
      this.x > window.innerWidth
      || this.x < 0
      || this.y > window.innerHeight
      || this.y < 0
    ) {
      this.r = getRandom('fnr')
      if (Math.random() > 0.4) {
        this.x = getRandom('x')
        this.y = 0
        this.s = getRandom('s')
        this.r = getRandom('r')
      } else {
        this.x = window.innerWidth
        this.y = getRandom('y')
        this.s = getRandom('s')
        this.r = getRandom('r')
      }
    }
  }
}

class SakuraList {
  list: Sakura[]

  constructor() {
    this.list = []
  }

  clear() {
    this.list = []
  }

  push(sakura: Sakura) {
    this.list.push(sakura)
  }

  update() {
    this.list.forEach(sakura => sakura.update())
  }
}

function getRandom(option: string): any {
  let ret: any
  let random: number
  switch (option) {
    case 'x':
      ret = Math.random() * window.innerWidth
      break
    case 'y':
      ret = Math.random() * window.innerHeight
      break
    case 's':
      ret = Math.random()
      break
    case 'r':
      ret = Math.random() * 6
      break
    case 'fnx':
      random = -0.5 + Math.random()
      ret = (x: number) => x + 0.5 * random - 1.7
      break
    case 'fny':
      random = 1.5 + Math.random() * 0.7
      ret = (x: number, y: number) => y + random
      break
    case 'fnr':
      random = Math.random() * 0.03
      ret = (r: number) => r + random
      break
  }
  return ret
}

class SakuraEffect {
  sakuraContainer = new Container()
  sakuraList = new SakuraList()

  startSakura(app: Application) {
    this.stop()
    app.stage.addChild(this.sakuraContainer)

    for (let i = 0; i < 50; i++) {
      const randomX = getRandom('x')
      const randomY = getRandom('y')
      const randomS = getRandom('s')
      const randomR = getRandom('r')
      const randomFnx = getRandom('fnx')
      const randomFny = getRandom('fny')
      const randomFnR = getRandom('fnr')

      const sakura = new Sakura(randomX, randomY, randomS, randomR, {
        x: randomFnx,
        y: randomFny,
        r: randomFnR,
      })

      this.sakuraContainer.addChild(sakura.sprite)
      this.sakuraList.push(sakura)
    }

    tickerCB = () => {
      this.sakuraList.update()
    }
    tickerManager.addListener('sakura', tickerCB)
  }

  stop() {
    if (tickerCB) {
      this.sakuraList.clear()
      this.sakuraContainer.removeChildren()
      tickerManager.removeListener('sakura')
      tickerCB = null
    }
  }
}

const sakuraEffect = new SakuraEffect()

const effect = {
  start: sakuraEffect.startSakura.bind(sakuraEffect),
  stop: sakuraEffect.stop.bind(sakuraEffect),
}

effectsManager.install({
  name: 'sakura',
  effect,
})
