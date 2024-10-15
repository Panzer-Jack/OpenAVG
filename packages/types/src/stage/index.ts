import type { AlphaFilter, Container } from 'pixi.js'

export interface IStages {
  game2DLayer: Container
  novelLayer: Container
  menuLayer: Container
}

export type IBgFilter = [AlphaFilter]

export * from './novel'
// export * from './menu'
