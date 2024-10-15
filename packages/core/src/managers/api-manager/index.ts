import type { IApiCore } from '@openavg/types'

class ApiManager {
  apiCore: IApiCore

  constructor() {}

  init(apiCore: IApiCore) {
    this.apiCore = apiCore
  }

  // 使用泛型推断参数和返回值类型
  async fetch<K extends keyof IApiCore>(
    { name, params }: { name: K, params: Parameters<IApiCore[K]>[0] },
  ): Promise<ReturnType<IApiCore[K]>> {
    return await this.apiCore[name](params)
  }
}

export const apiManager = new ApiManager()
