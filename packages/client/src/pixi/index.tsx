import { useLoader } from '@/store'
import { openAVGCore } from '@openavg/core'

import { useCallback, useEffect, useRef } from 'react'

export function PixiCanvas() {
  const pixiCanvasRef = useRef<HTMLCanvasElement>(null)
  const setPixiOnload = useLoader(store => store.setPixiOnload)

  const initPixi = useCallback(async () => {
    await openAVGCore.pixiInstance.install(
      pixiCanvasRef.current as HTMLCanvasElement,
    )
    setPixiOnload(true)
  }, [])

  useEffect(() => {
    initPixi()
  }, [initPixi])

  return (
    <canvas
      style={{ width: '100%', height: '100%' }}
      id="pixi-canvas"
      ref={pixiCanvasRef}
    />
  )
}
