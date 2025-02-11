import type { Application } from 'pixi.js'
import type { IChapter } from '../stage'

interface IAsset {
  name: string
  src: string
}

export interface IEffect {
  start: (app: Application) => void
  stop: (app: Application) => void
}

export type IEvent<T> = ({
  app,
  stageManager,
}: {
  app: Application
  stageManager: T
}) => void

export interface IAssets {
  images?: IAsset[]
  audios?: IAsset[]
  voices?: IAsset[]
  videos?: IAsset[]

}

export interface IGlobalConfig {
  title: string

  favicon: string

  assets: IAssets
}

export interface IApiCore {
  fetchGlobalConfig: () => Promise<IGlobalConfig>
  fetchChapter: ({ name }: { name: string }) => Promise<IChapter>
  fetchChapterAssets: () => Promise<IAssets>
  [name: string]: (params: any) => Promise<any>
}
