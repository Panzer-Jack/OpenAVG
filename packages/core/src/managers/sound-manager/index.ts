import type { ISounds } from '@openavg/types'
import type { Sound } from '@pixi/sound'
import type { Application } from 'pixi.js'

class SoundManager {
  app: Application
  currentTargets: ISounds = {
    bgm: [],
    voice: []
  }
  targetsVolume = {
    bgm: 0.4,
    voice: 1,
    main: 1,
  }

  constructor() {}

  init(app: Application) {
    this.app = app
    return this
  }

  setVolume({
    bgm,
    voice,
    main
  }: {
    bgm: number
    voice: number
    main: number
  }) {
    this.targetsVolume.main = main
    this.targetsVolume.bgm = bgm
    this.targetsVolume.voice = voice

    this.currentTargets.bgm.forEach((bgm) => {
      bgm.volume = this.targetsVolume.bgm * this.targetsVolume.main
    })

    this.currentTargets.voice.forEach((voice) => {
      voice.volume = this.targetsVolume.voice * this.targetsVolume.main
    })
  }

  playBgm(sound: Sound) {
    sound.volume = this.targetsVolume.bgm * this.targetsVolume.main
    sound.play()
    this.currentTargets.bgm.push(sound)
  }

  playVoice(sound: Sound) {
    sound.volume = this.targetsVolume.voice * this.targetsVolume.main
    sound.play()
    this.currentTargets.voice.push(sound)
  }

  stopBgm() {
    this.currentTargets.bgm.forEach((bgm) => {
      bgm.stop()
    })
    this.currentTargets.bgm.length = 0
  }

  stopVoice() {
    this.currentTargets.voice.forEach((voice) => {
      voice.stop()
    })
    this.currentTargets.voice.length = 0
  }

  stopMain() {
    this.stopBgm()
    this.stopVoice()
  }
}

export const soundManager = new SoundManager()
