import { getDataList } from './getDataList'
import { onReturn } from './onReturn'

class Actions {
  private _onReturn = onReturn
  private _getDataList = getDataList
  constructor() {}

  get onReturn() {
    return this._onReturn
  }

  get getDataList() {
    return this._getDataList
  }
}

export const actions = new Actions()
