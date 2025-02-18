import type { ITalkRaw } from '@openavg/types'
import { Sprite } from 'pixi.js'

import Hooks from '../../Hooks'

export function handleTalk({ assetName }: { assetName: ITalkRaw }) {
  const hooks = Hooks.getInstance()
  const sceneManager = hooks.sceneManager
  const assetsPack = hooks.assetsPack

  const speaker = {
    name: '',
    voice: null,
    avatars: [],
  }

  // const speakerExp = {
  //   voiceKey: null,
  //   avatarsKey: [],
  // }

  const sentence = assetName.sentence
  if (typeof assetName.speaker === 'string') {
    speaker.name = assetName.speaker
  } else {
    speaker.name = assetName.speaker.name

    if (assetName.speaker.avatars && assetName.speaker.avatars.length) {
      assetName.speaker.avatars.forEach((avatar) => {
        const avatorAsset = assetsPack.SPRITE_TEXTURE[avatar]
        const avatorSprite = new Sprite(avatorAsset)
        speaker.avatars.push(avatorSprite)
        // speakerExp.avatarsKey.push(avatar)
      })
    }

    if (assetName.speaker.voice) {
      const voiceSprite = assetsPack.CHARACTER_SOUND[assetName.speaker.voice]
      voiceSprite.play()
      speaker.voice = voiceSprite
      // speakerExp.voiceKey = assetName.speaker.voice
    }
  }
  sceneManager.dialogueBox.updateDialogue({
    speaker,
    sentence,
  })

  // 如果之前存在则销毁
  const currentScene = sceneManager.currentScene
  if (currentScene.talk) {
    if (currentScene.talk.speaker.avatars) {
      currentScene.talk.speaker.avatars.forEach(avatar =>
        avatar.destroy(),
      )
      // currentScene.info.actions.speaker.avatars = null
    }
    if (currentScene.talk.speaker.voice) {
      currentScene.talk.speaker.voice.stop()
      // currentScene.info.actions.speaker.voice = null
    }
  }

  // currentScene.info.actions = {
  //   ...currentScene.info.actions,
  //   speaker: {
  //     name: speaker.name,
  //     voice: speakerExp.voiceKey,
  //     avatars: speakerExp.avatarsKey,
  //   },
  //   sentence,
  // }

  currentScene.talk = {
    speaker: {
      name: speaker.name,
      voice: speaker.voice,
      avatars: speaker.avatars,
    },
    sentence,
  }
}
