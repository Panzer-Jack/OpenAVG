import type { IAssets, IGlobalConfig } from '@openavg/types'
import type { Sound } from '@pixi/sound'
import type { Texture } from 'pixi.js'
import { isEmpty } from 'lodash'

import { StageType } from '../../constants'

/** 包参数：游戏音频 */
export interface IPackGameAudio {
  [name: string]: string
}

/** 包参数：角色声音 */
export interface IPackCharacterSound {
  [name: string]: string
}

/** 包参数：精灵纹理 */
export interface IPackSpriteTexture {
  [name: string]: string
}

export interface IPackVideoTexture {
  [name: string]: string
}

/** 资源包 */
export class AssetsPacks {
  /** 资源类型 */
  type: StageType
  /** 资源名 */
  // name: string
  /** 子包：游戏音频 */
  GAME_AUDIO = {} as Record<keyof IPackGameAudio, Sound>
  /** 子包：角色声音 */
  CHARACTER_SOUND = {} as Record<keyof IPackCharacterSound, Sound>
  /** 子包：精灵纹理 */
  SPRITE_TEXTURE = {} as Record<keyof IPackSpriteTexture, Texture>

  VIDEO_TEXTURE = {} as Record<keyof IPackVideoTexture, Texture>

  private gameAudioRaw = []
  private characterSoundRaw = []
  private spriteTextrueRaw = {}
  private videoTextrueRaw = {}

  constructor({ type }: { type: StageType }) {
    this.type = type
  }

  // 读取全局配置，单独领出来方便后面改造
  loadGlobalConfig({ globalConfig }: { globalConfig?: IGlobalConfig }) {
    if (this.type === StageType.GLOBAL) {
      globalConfig.assets.images.forEach((image) => {
        this.spriteTextrueRaw[image.name] = image.src
      })
      globalConfig.assets.videos.forEach((video) => {
        this.videoTextrueRaw[video.name] = video.src
      })
      globalConfig.assets.audios.forEach((music) => {
        this.gameAudioRaw.push({
          alias: music.name,
          src: music.src,
        })
      })
      globalConfig.assets.voices.forEach((voice) => {
        this.characterSoundRaw.push({
          alias: voice.name,
          src: voice.src,
        })
      })
    }
  }

  loadConfig({ assets }: { assets?: IAssets }) {
    if (this.type === StageType.NOVEL) {
      // this.name = chapter.title
      assets.images.forEach((image) => {
        this.spriteTextrueRaw[image.name] = image.src
      })
      assets.audios.forEach((music) => {
        this.gameAudioRaw.push({
          alias: music.name,
          src: music.src,
        })
      })
      assets.voices.forEach((voice) => {
        this.characterSoundRaw.push({
          alias: voice.name,
          src: voice.src,
        })
      })
    }
  }

  /** 加载函数 */
  async loadAllPacks({ loadBundle }: { loadBundle: BundleLoader }) {
    if (!isEmpty(this.gameAudioRaw)) {
      await loadBundle('GAME_AUDIO', this.gameAudioRaw)
    }
    if (!isEmpty(this.characterSoundRaw)) {
      await loadBundle('CHARACTER_SOUND', this.characterSoundRaw)
    }
    if (!isEmpty(this.spriteTextrueRaw)) {
      await loadBundle('SPRITE_TEXTURE', this.spriteTextrueRaw)
    }
    if (!isEmpty(this.videoTextrueRaw)) {
      await loadBundle('VIDEO_TEXTURE', this.videoTextrueRaw)
    }
  }

  /** 卸载函数 */
  async unloadAllPacks({ unloadBundle }: { unloadBundle: BundleUnloader }) {
    if (!isEmpty(this.GAME_AUDIO)) {
      await unloadBundle('GAME_AUDIO')
    }
    if (!isEmpty(this.CHARACTER_SOUND)) {
      await unloadBundle('CHARACTER_SOUND')
    }
    if (!isEmpty(this.SPRITE_TEXTURE)) {
      await unloadBundle('SPRITE_TEXTURE')
    }
    if (!isEmpty(this.VIDEO_TEXTURE)) {
      await unloadBundle('VIDEO_TEXTURE')
    }
  }
}

type BundleContentsArray = {
  alias: string
  src: string
}[]
/** 分包加载器 */
type BundleLoader = (
  bundleName: string,
  bundleContents: Record<string, string> | BundleContentsArray
) => Promise<any>

/** 分包卸载器 */
type BundleUnloader = (bundleName: string) => Promise<any>
