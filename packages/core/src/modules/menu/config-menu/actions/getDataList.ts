import type { SaveDataList } from '@openavg/types'
import localforage from 'localforage'
import { openAVGCore } from '../../../..'

export async function getDataList() {
  const dataList: SaveDataList = await localforage.getItem(`${openAVGCore.gameTitle}-saveGame`)
  return dataList
}
