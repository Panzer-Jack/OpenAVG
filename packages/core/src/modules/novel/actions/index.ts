import type { IActions, IBackground, IImage, IMusic, ITalkRaw } from '@openavg/types'

import { NovelActionType } from '../constants'
import { handleBackground, handleImages, handleMusic, handleTalk } from './sprites'

async function _exec({
  actionName,
  assetName,
}: {
  actionName: NovelActionType
  assetName: IMusic | IBackground | ITalkRaw | IImage[]
}) {
  switch (actionName) {
    case NovelActionType.talk:
      handleTalk({
        assetName: assetName as ITalkRaw,
      })
      break
    case NovelActionType.background:
      await handleBackground({
        assetName: assetName as IBackground,
      })
      break
    case NovelActionType.music:
      handleMusic({
        assetName: assetName as IMusic,
      })
      break
    case NovelActionType.image:
      handleImages({
        assetName: assetName as IImage[],
      })
      break
  }
}

export async function execActions({ actions }: { actions: IActions }) {
  console.log('actions', actions)

  if (actions.background) {
    await _exec({
      actionName: NovelActionType.background,
      assetName: actions.background,
    })
  }

  if (actions.images) {
    await _exec({
      actionName: NovelActionType.image,
      assetName: actions.images,
    })
  }

  if (actions.sentence) {
    await _exec({
      actionName: NovelActionType.talk,
      assetName: {
        sentence: actions.sentence,
        speaker: actions.speaker,
      },
    })
  }

  if (actions.music) {
    await _exec({
      actionName: NovelActionType.music,
      assetName: actions.music,
    })
  }
}
