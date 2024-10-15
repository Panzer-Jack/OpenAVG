import type { Sound } from '@pixi/sound'
import type { Container, Sprite } from 'pixi.js'

export interface IScene {
  name?: string
  currentActionsId: number
  actionsList: IActions[]
  background?: Sprite // 存档用，当前生效的背景
  music?: Sound //   存档用，当前生效的音乐
  talk?: ITalk // 存档用，当前进行的对话
  images?: Sprite[] // 存档用，当前进行的图片
}

export interface ITalk {
  speaker?: {
    name: string
    voice?: Sound
    avatars?: Sprite[] // 小头像：可变化
  }
  sentence: string
}

export interface ISceneContainers {
  background?: Container
  images?: Container
  dialogueBox?: Container
  ui?: Container
}

// ------ Raw ------
// 详细背景指令类
export interface IBackgroundExtends {
  name: string // 背景名称
  src?: string // 可选：背景资源的路径
}

export type IBackground = IBackgroundExtends | string

// 详细音乐指令类
export interface IMusicExtends {
  name: string // 音乐名称
  loop?: boolean // 可选：是否循环播放
  destroy?: boolean // 可选：是否销毁
  src?: string // 可选：音乐资源的路径
}

export type IMusic = IMusicExtends | string

// 详细人物指令类
export interface ISpeaker {
  name: string
  voice?: string
  avatars?: string[] // 小头像：可变化
}

// 说话指令
export interface ITalkRaw {
  speaker?: ISpeaker | string
  sentence: string
}

// 立绘类
export interface IImage {
  name: string
  position: IPosition
}

export type IPosition = 'left' | 'right' | 'center' // 根据添加顺序向后叠加

// 指令的类型
export interface IActions {
  background?: IBackground
  noDialogBox?: boolean
  images?: IImage[]
  music?: IMusic
  speaker?: ISpeaker
  sentence?: string
  choice?: string[]
}

// 资源的类型
export interface IAsset {
  name: string
  src: string
}

// 场景的类型
export interface ISceneRaw {
  name?: string
  actions: IActions[]
}

// 小说JSON数据结构
export interface IChapter {
  title: string
  assets: {
    images: IAsset[]
    audios: IAsset[]
    voices: IAsset[]
  }
  scenes: ISceneRaw[]
}
